using System.ComponentModel.DataAnnotations;

namespace Blogger.View
{
    public class ArticleCreateView
    {
        public long BlogId { get; set; }
        
        [MaxLength(256)]
        public string Title { get; set; }
        
        [MaxLength(1024)]
        public string Content { get; set; }
    }
}