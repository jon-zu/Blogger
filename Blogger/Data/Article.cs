using System.Collections.Generic;

namespace Blogger.Data
{
    public class Article : OwnedEntity
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public IList<Comment> Comments { get; set; }
        
        public Blog Blog { get; set; }
        public long BlogId { get; set; }
    }
}