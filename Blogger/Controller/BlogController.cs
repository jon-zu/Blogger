using System;
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
    [Route("api/[controller]")]
    public class BlogController: BlogBaseController
    {
        private readonly IAuthorizationService _authorizationService;
        
        public BlogController(UserManager<User> userManager, BlogContext context, IAuthorizationService authorizationService) : base(userManager, context)
        {
            _authorizationService = authorizationService;
        }
    
        [HttpGet]
        [Route("{id:long}")]
        public async Task<ActionResult<BlogView>> Get(long id)
        {
            var blog = await Context.Blogs
                .Include(b => b.Owner)
                .FirstOrDefaultAsync(b => b.Id == id);
            
            if(blog == null)
                return NotFound();
            
            var authResult = await _authorizationService
                .AuthorizeAsync(User, blog, Operations.Read);
            
            if (!authResult.Succeeded)
                return Unauthorized();

            return new BlogView(blog);
        }
        

        [HttpGet]
        public async Task<ActionResult<IList<BlogView>>> GetAll()
        {
            var list = await Context.Blogs
                .Include(b => b.Owner)
                .Select(b => new BlogView(b))
                .ToListAsync();

            return list;
        }
        
        [HttpPost]
        public async Task<ActionResult<BlogView>> Create([FromBody] BlogCreateView create)
        {
            var owner = await CurrentUser();
            
            var blog = new Blog
            {
                Owner = owner,
                About = create.About,
                Title = create.Title
            };

            Context.Blogs.Add(blog);
            await Context.SaveChangesAsync();

            return Ok(new BlogView(blog));
        }
        
        [HttpPut]
        [Route("{id:long}")]
        public async Task<ActionResult<BlogView>> Update(long id, [FromBody] BlogCreateView create)
        {
            var blog = await Context.Blogs
                .Include(b => b.Owner)
                .FirstOrDefaultAsync(b => b.Id == id);
            
            if (blog == null)
                return NotFound();

            var authResult = await _authorizationService
                .AuthorizeAsync(User, blog, Operations.Update);
            
            if (!authResult.Succeeded)
                return Unauthorized();

            blog.Title = create.Title;
            blog.About = create.About;
            await Context.SaveChangesAsync();

            return new BlogView(blog);
        }

        [HttpDelete]
        [Route("{id:long}")]
        public async Task<ActionResult> Delete(long id)
        {
            var blog = await Context.Blogs
                .Include(b => b.Owner)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (blog == null)
                return NotFound();
            
            var authResult = await _authorizationService
                .AuthorizeAsync(User, blog, Operations.Delete);
            
            if (!authResult.Succeeded)
                return Unauthorized();
            
            Context.Blogs.Remove(blog);
            await Context.SaveChangesAsync();
            return Ok();
        }
    }
}