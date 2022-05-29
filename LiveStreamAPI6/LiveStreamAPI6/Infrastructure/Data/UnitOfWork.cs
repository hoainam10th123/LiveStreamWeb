using AutoMapper;
using LiveStreamAPI6.Core.Interface;
using LiveStreamAPI6.Infrastructure.Repository;

namespace LiveStreamAPI6.Infrastructure.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public UnitOfWork(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public IMessageRepository MessageRepository => new MessageRepository(_context);
        public IUserRepository UserRepository => new UserRepository(_context, _mapper);

        public async Task<bool> Complete()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public bool HasChanges()
        {
            return _context.ChangeTracker.HasChanges();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
