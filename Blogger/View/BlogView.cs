using System;
using Blogger.Data;

namespace Blogger.View
{
    public class BlogView
    {
        public BlogView()
        {}
        
        public BlogView(Blog blog)
        {
            Id = blog.Id;
            Title = blog.Title;
            About = blog.About;
            Owner = new UserView(blog.Owner);
        }

        public UserView Owner { get; set; }

        public long Id { get; set; }
        public string Title { get; set; }
        public string About { get; set; }
    }
}