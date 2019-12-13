using System.Security.Claims;
using System.Threading.Tasks;
using Blogger.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Blogger.Controller
{
    public abstract class BlogBaseController : ControllerBase
    {
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