using LiveStreamAPI6.Core.Entities;
using LiveStreamAPI6.SignalR;

namespace LiveStreamAPI6.Core.Interface
{
    public interface IUserRepository
    {
        Task<AppUser> GetUserByIdAsync(Guid id);
        Task<AppUser> GetUserByUsernameAsync(string username);
        Task<string[]> GetUsersOnline(PresenceTracker presenceTracker);
    }
}
