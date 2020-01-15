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
    public class CommentController: BlogBaseController
    {
        private readonly IAuthorizationService _authorizationService;
        
        public CommentController(UserManager<User> userManager, BlogContext context, IAuthorizationService authorizationService) : base(userManager, context)
        {
            _authorizationService = authorizationService;
        }
        
        [HttpGet]
        [Route("ByArticle/{id:long}")]
        public async Task<ActionResult<IList<CommentView>>> ForArticle(long id)
        {
            var list = await Context.Comments
                .Include(a => a.Owner)
                .Where(a => a.ArticleId == id)
                .Select(b => new CommentView(b))
                .ToListAsync();

            return list;
        }
    
        [HttpGet]
        [Route("{id:long}")]
        public async Task<ActionResult<CommentView>> Get(long id)
        {
            var comment = await Context.Comments
                .Include(a => a.Owner)
                .FirstOrDefaultAsync(a => a.Id == id);
            
            if(comment == null)
                return NotFound();
            
            var authResult = await _authorizationService
                .AuthorizeAsync(User, comment, Operations.Read);
            
            if (!authResult.Succeeded)
                return Unauthorized();

            return new CommentView(comment);
        }
        
        [HttpPost]
        public async Task<ActionResult<CommentView>> Create([FromBody] CommentCreateView create)
        {
            var owner = await CurrentUser();
            var article = await Context.Articles.FindAsync(create.ArticleId);

            if (article == null)
                return NotFound();
            
            var comment = new Comment
            {
                Article = article,
                CreatedAt = DateTime.UtcNow,
                Content = create.Content,
                Owner = owner
            };

            Context.Comments.Add(comment);
            await Context.SaveChangesAsync();
            
            return Ok(new CommentView(comment));
        }
        
        [HttpPut]
        [Route("{id:long}")]
        public async Task<ActionResult<CommentView>> Update(long id, [FromBody] CommentCreateView create)
        {
            var comment = await Context.Comments
                .Include(c => c.Owner)
                .FirstOrDefaultAsync(c => c.Id == id);
            
            if (comment == null)
                return NotFound();
            
            var authResult = await _authorizationService
                .AuthorizeAsync(User, comment, Operations.Update);
            
            if (!authResult.Succeeded)
                return Unauthorized();


            comment.Content = create.Content;
            await Context.SaveChangesAsync();

            return new CommentView(comment);
        }

        [HttpDelete]
        [Route("{id:long}")]
        public async Task<ActionResult> Delete(long id)
        {
            var comment = await Context.Comments
                .Include(c => c.Owner)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (comment == null)
                return NotFound();
            
            var authResult = await _authorizationService
                .AuthorizeAsync(User, comment, Operations.Delete);
            
            if (!authResult.Succeeded)
                return Unauthorized();
            
            Context.Comments.Remove(comment);
            await Context.SaveChangesAsync();
            return Ok();
        }
    }
}