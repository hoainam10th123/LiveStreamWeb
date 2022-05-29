using AutoMapper;
using LiveStreamAPI6.Core.Entities;
using LiveStreamAPI6.Core.Interface;
using LiveStreamAPI6.Dtos;
using LiveStreamAPI6.Infrastructure.Data;
using LiveStreamAPI6.SignalR;
using Microsoft.EntityFrameworkCore;

namespace LiveStreamAPI6.Infrastructure.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public UserRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<AppUser> GetUserByIdAsync(Guid id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            return await _context.Users
                .Include(p => p.Posts)
                .SingleOrDefaultAsync(x => x.UserName == username);
        }


        public async Task<string[]> GetUsersOnline(PresenceTracker presenceTracker)
        {
            return await presenceTracker.GetOnlineUsers();
        }
    }
}
