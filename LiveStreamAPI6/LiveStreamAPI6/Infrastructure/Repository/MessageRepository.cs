using LiveStreamAPI6.Core.Entities;
using LiveStreamAPI6.Core.Interface;
using LiveStreamAPI6.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LiveStreamAPI6.Infrastructure.Repository
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _context;
        public MessageRepository(DataContext context)
        {
            _context = context;
        }

        public void AddGroup(Group group)
        {
            _context.Groups.Add(group);
        }

        public async Task UpdateGroup(Group group)
        {
            var groupDb = await _context.Groups.FindAsync(group.Name);
            groupDb = group;
        }

        public async Task<Group> GetGroupForConnection(string connectionId)
        {
            return await _context.Groups.Include(x => x.Connections)
                .Where(x => x.Connections.Any(c => c.ConnectionId == connectionId))
                .FirstOrDefaultAsync();
        }

        public void RemoveConnection(Connection connection)
        {
            _context.Connections.Remove(connection);
        }

        public async Task<Group> GetGroup(string groupName)
        {
            return await _context.Groups.FindAsync(groupName);
        }
    }
}
