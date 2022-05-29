using LiveStreamAPI6.Core.Entities;
using LiveStreamAPI6.Core.Interface;
using LiveStreamAPI6.Dtos;
using LiveStreamAPI6.Errors;
using LiveStreamAPI6.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LiveStreamAPI6.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly ITokenService _tokenService;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;

        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ITokenService tokenService)
        {
            _tokenService = tokenService;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users
                .SingleOrDefaultAsync(x => x.UserName == loginDto.UserName.ToLower());

            if (user == null)
            {
                ModelState.AddModelError("username", "Invalid Username");
                return ValidationProblem();
            }
           
            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.Succeeded) 
            {
                ModelState.AddModelError("password", "Invalid password");
                return ValidationProblem();
            }

            return new UserDto
            {
                Id = user.Id,
                DisplayName = user.DisplayName,
                Token = await _tokenService.CreateTokenAsync(user),
                UserName = user.UserName
            };
        }

        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == User.GetUsername());
            if (user == null) return BadRequest(new ApiResponse(400, "CurrentUser == null"));
            return new UserDto
            {
                Id = user.Id,
                DisplayName = user.DisplayName,
                Token = await _tokenService.CreateTokenAsync(user),
                UserName = user.UserName
            };
        }
    }
}
