using Blogger.Data;

namespace Blogger.View
{
    public class UserView
    {
        public UserView()
        {
            
        }
        
        public UserView(User user)
        {
            Id = user.Id;
            Name = user.UserName;
        }

        public string Name { get; set; }

        public string Id { get; set; }
    }
}