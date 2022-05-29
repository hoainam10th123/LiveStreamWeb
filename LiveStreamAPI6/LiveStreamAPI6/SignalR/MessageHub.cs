using AutoMapper;
using LiveStreamAPI6.Core.Entities;
using LiveStreamAPI6.Core.Interface;
using LiveStreamAPI6.Dtos;
using LiveStreamAPI6.Extensions;
using Microsoft.AspNetCore.SignalR;

namespace LiveStreamAPI6.SignalR
{
    public class MessageHub : Hub
    {
        private readonly IHubContext<PresenceHub> _presenceHub;
        private readonly PresenceTracker _presenceTracker;
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserLiveStreamTracker _userLiveStreamTracker;

        public MessageHub(IUnitOfWork unitOfWork, IHubContext<PresenceHub> presenceHub, PresenceTracker presenceTracker, UserLiveStreamTracker userLiveStreamTracker)
        {
            _unitOfWork = unitOfWork;
            _presenceHub = presenceHub;
            _presenceTracker = presenceTracker;
            _userLiveStreamTracker = userLiveStreamTracker;
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var roomId = httpContext.Request.Query["roomId"].ToString();
            var group = await AddToGroup(roomId);            

            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);            

            await _presenceHub.Clients.All.SendAsync("UpdatedGroup", group);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var group = await RemoveFromMessageGroup();
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, group.Name);
            await _userLiveStreamTracker.UserDisconnectedLiveStream(Context.User.GetUsername());
            //await Clients.Group(group.Name).SendAsync("UpdatedGroup", group);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendComment(CommentDto commentDto)
        {
            var userName = Context.User.GetUsername();
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(userName);
            
            commentDto.DateCreated = DateTime.Now;
            commentDto.DisplayName = user.DisplayName;
            commentDto.Username = userName;

            await Clients.Group(commentDto.RoomId).SendAsync("OnUserCommentInGroup", commentDto);
        }

        private async Task<Group> RemoveFromMessageGroup()
        {
            var group = await _unitOfWork.MessageRepository.GetGroupForConnection(Context.ConnectionId);
            var connection = group.Connections.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            _unitOfWork.MessageRepository.RemoveConnection(connection);

            if (await _unitOfWork.Complete()) return group;

            throw new HubException("Fail to remove from group");
        }

        private async Task<Group> AddToGroup(string groupName)
        {
            var groupDb = await _unitOfWork.MessageRepository.GetGroup(groupName);
            if(groupDb == null)
            {
                var connection = new Connection(Context.ConnectionId, Context.User.GetUsername());
                var group = new Group(groupName);
                _unitOfWork.MessageRepository.AddGroup(group);
                group.Connections.Add(connection);
                if (await _unitOfWork.Complete()) return group;
            }
            else
            {
                var connection = new Connection(Context.ConnectionId, Context.User.GetUsername());                                
                groupDb.Connections.Add(connection);
                await _unitOfWork.MessageRepository.UpdateGroup(groupDb);
                if (await _unitOfWork.Complete()) return groupDb;
            }                       

            throw new HubException("Failed to join group");
        }

        /// <summary>
        /// chuyen den user dang phat stream, tren DetailPage FE
        /// </summary>
        /// <param name="toUsername"></param>
        /// <returns></returns>
        public async Task SendLiveStream()
        {
            var usernamLive = await _userLiveStreamTracker.GetUsernameLivingStream();
            var connections = await _presenceTracker.GetConnectionsForUser(usernamLive);
            if(connections != null)
                await _presenceHub.Clients.Clients(connections).SendAsync("OnUpDateStream", Context.User.GetUsername());
        }

        public async Task StartLiveStream()
        {
            await _userLiveStreamTracker.UserConnectedToLiveStream(Context.User.GetUsername());
        }
    }
}
