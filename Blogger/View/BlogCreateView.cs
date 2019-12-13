using System.ComponentModel.DataAnnotations;

namespace Blogger.View
{
    public class BlogCreateView
    {
        [MaxLength(256)]
        public string Title { get; set; }
        
        [MaxLength(256)]
        public string About { get; set; }
    }
}