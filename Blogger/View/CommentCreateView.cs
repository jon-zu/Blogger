using System.ComponentModel.DataAnnotations;

namespace Blogger.View
{
    public class CommentCreateView
    {
        public long ArticleId { get; set; }
        
        [MaxLength(256)]
        public string Content { get; set; }
    }
}