using LiveStreamAPI6.Core.Interface;
using LiveStreamAPI6.SignalR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LiveStreamAPI6.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MembersController : ControllerBase
    {
        private readonly PresenceTracker _presenceTracker;
        private readonly IUnitOfWork _unitOfWork;
        public MembersController(PresenceTracker presenceTracker, IUnitOfWork unitOfWork)
        {
            _presenceTracker = presenceTracker;
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsersOnline()
        {
            return Ok(await _unitOfWork.UserRepository.GetUsersOnline(_presenceTracker));
        }
    }
}
