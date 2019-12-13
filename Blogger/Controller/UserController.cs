using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Blogger.Data;
using Blogger.View;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace Blogger.Controller
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class UserController : BlogBaseController
    {
        public UserController(UserManager<User> userManager, BlogContext context) : base(userManager, context)
        {
        }
        
        [HttpGet]
        [Route("current")]
        public async Task<UserView> Current()
        {
            return new UserView(await CurrentUser());
        }
        
        
        [HttpGet]
        [Route("{id}")]
        public async Task<UserView> Get(string id)
        {
            var user = await UserManager.FindByIdAsync(id);
            return new UserView(user);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("register")]
        public async Task<ActionResult<UserView>> Register([FromBody] LoginInputView loginInputView)
        {
            var user = new User
            {
                Email = "Test@test.com",
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = loginInputView.Username
            };
            var register = await UserManager.CreateAsync(user, loginInputView.Password);
            if (!register.Succeeded)
                return BadRequest();

            return Ok(new UserView(user));
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("login")]
        public async Task<ActionResult<AuthTokenView>> Login([FromBody] LoginInputView loginInputView)
        {
            var user = await UserManager.FindByNameAsync(loginInputView.Username);

            if (user == null)
                return Unauthorized();

            if (!(await UserManager.CheckPasswordAsync(user, loginInputView.Password)))
                return Unauthorized();
            
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("A secret key or not"));
            var token = new JwtSecurityToken(
                issuer: "http://test.com",
                audience: "http://test.com",
                expires: DateTime.Now.AddHours(3),
                claims: claims,
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );


            return Ok(new AuthTokenView
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Expiration = token.ValidTo
            });
        }
    }
}