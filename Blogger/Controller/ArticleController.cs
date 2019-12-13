using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Blogger.Authorization;
using Blogger.Data;
using Blogger.View;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Blogger.Controller
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class ArticleController : BlogBaseController
    {
        private readonly IAuthorizationService _authorizationService;
        public ArticleController(UserManager<User> userManager, BlogContext context, IAuthorizationService authorizationService) : base(userManager, context)
        {
            _authorizationService = authorizationService;
        }
        
        [HttpGet]
        [Route("blog/{id:long}")]
        public async Task<ActionResult<IList<ArticleView>>> ForBlog(long id)
        {
            var list = await Context.Articles
                .Include(a => a.Owner)
                .Where(a => a.BlogId == id)
                .Select(b => new ArticleView(b))
                .ToListAsync();

            return list;
        }
        
        [HttpGet]
        [Route("{id:long}")]
        public async Task<ActionResult<ArticleView>> Get(long id)
        {
            var article = await Context.Articles
                .Include(a => a.Owner)
                .FirstOrDefaultAsync(a => a.Id == id);
            
            if(article == null)
                return NotFound();
            
            var authResult = await _authorizationService
                .AuthorizeAsync(User, article, Operations.Read);
            
            if (!authResult.Succeeded)
                return Unauthorized();

            return new ArticleView(article);
        }
        
        [HttpPost]
        public async Task<ActionResult<ArticleView>> Create([FromBody] ArticleCreateView articleCreateView)
        {
            var owner = await CurrentUser();
            var blog = await Context.Blogs
                .Where(b => b.Owner == owner)
                .FirstOrDefaultAsync(b => b.Id == articleCreateView.BlogId);

            if (blog == null)
                return NotFound();
            
            var article = new Article
            {
                Blog = blog,
                Content = articleCreateView.Content,
                Title = articleCreateView.Title,
                Owner = owner
            };

            Context.Articles.Add(article);
            await Context.SaveChangesAsync();

            return Ok(new ArticleView(article));
        }
        
        [HttpPut]
        [Route("{id:long}")]
        public async Task<ActionResult<ArticleView>> Update(long id, [FromBody] ArticleCreateView articleCreateView)
        {
            var owner = await CurrentUser();
            var article = await Context.Articles
                .Include(a => a.Owner)
                .FirstOrDefaultAsync(a => a.Id == id);
            
            if (article == null)
                return NotFound();
            
            var authResult = await _authorizationService
                .AuthorizeAsync(User, article, Operations.Update);
            
            if (!authResult.Succeeded)
                return Unauthorized();


            article.Title = articleCreateView.Title;
            article.Content = articleCreateView.Content;
            await Context.SaveChangesAsync();

            return new ArticleView(article);
        }

        [HttpDelete]
        [Route("{id:long}")]
        public async Task<ActionResult> Delete(long id)
        {
            var article = await Context.Articles
                .FirstOrDefaultAsync(a => a.Id == id);

            if (article == null)
                return NotFound();
            
            var authResult = await _authorizationService
                .AuthorizeAsync(User, article, Operations.Delete);
            
            if (!authResult.Succeeded)
                return Unauthorized();
            
            Context.Articles.Remove(article);
            await Context.SaveChangesAsync();
            return Ok();
        }
    }
}