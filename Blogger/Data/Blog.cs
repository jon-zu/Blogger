using System.Collections.Generic;

namespace Blogger.Data
{
    public class Blog : OwnedEntity
    {
        public long Id { get; set; }
        public IList<Article> Articles { get; set; }
        public string Title { get; set; }
        public string About { get; set; }
    }
}