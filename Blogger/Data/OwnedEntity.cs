using Blogger.Data;

namespace Blogger.Data
{
    public abstract class OwnedEntity
    {
        public string OwnerId { get; set; }
        public User Owner { get; set; }
    }
}