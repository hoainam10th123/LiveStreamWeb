using LiveStreamAPI6.Core.Entities;

namespace LiveStreamAPI6.Core.Interface
{
    public interface IMessageRepository
    {
        void AddGroup(Group group);
        Task UpdateGroup(Group group);
        Task<Group> GetGroupForConnection(string connectionId);
        void RemoveConnection(Connection connection);
        Task<Group> GetGroup(string groupName);
    }
}
