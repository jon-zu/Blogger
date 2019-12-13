using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Blogger.Data
{
    public class User : IdentityUser
    {
        public IList<Blog> Blogs { get; set; }
        public IList<Article> Articles { get; set; }
        public IList<Comment> Comments { get; set; }
    }
}