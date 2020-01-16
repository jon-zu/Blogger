using System.Security.Claims;
using System.Threading.Tasks;
using Blogger.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;

namespace Blogger.Controller
{
    [Authorize(AuthenticationSchemes = AuthSchemes)]
    public abstract class BlogBaseController : ControllerBase
    {
       private const string AuthSchemes =
            CookieAuthenticationDefaults.AuthenticationScheme + "," +
            JwtBearerDefaults.AuthenticationScheme;


        protected BlogContext Context { get; }
        protected UserManager<User> UserManager { get; }

        public BlogBaseController(UserManager<User> userManager, BlogContext context)
        {
            UserManager = userManager;
            Context = context;
        }
        
        protected string CurrentUserSubject()
            => User.FindFirstValue(ClaimTypes.NameIdentifier);

        
        //TODO throw exception If user does not exist
        protected Task<User> CurrentUser()
            => UserManager.FindByIdAsync(CurrentUserSubject());


    }
}