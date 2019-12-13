using System;
using Blogger.Data;

namespace Blogger.View
{
    public class CommentView
    {
        public CommentView()
        {
            
        }
        
        public CommentView(Comment comment)
        {
            CreatedAt = comment.CreatedAt;
            Content = comment.Content;
            Id = comment.Id;
            Owner = new UserView(comment.Owner);
        }

        public DateTime CreatedAt { get; set; }

        public string Content { get; set; }

        public UserView Owner { get; set; }

        public long Id { get; set; }
    }
}