using System;

namespace Blogger.Data
{
    public class Comment : OwnedEntity
    {
        public long Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Content { get; set; }
        
        public Article Article { get; set; }
        public long ArticleId { get; set; }
    }
}