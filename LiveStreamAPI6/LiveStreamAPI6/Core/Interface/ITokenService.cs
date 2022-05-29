using LiveStreamAPI6.Core.Entities;

namespace LiveStreamAPI6.Core.Interface
{
    public interface ITokenService
    {
        Task<string> CreateTokenAsync(AppUser appUser);
    }
}
