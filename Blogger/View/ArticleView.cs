using Blogger.Data;

namespace Blogger.View
{
    public class ArticleView
    {
        public ArticleView()
        {
            
        }
        
        public ArticleView(Article article)
        {
            Id = article.Id;
            Title = article.Title;
            Content = article.Content;
            Owner = new UserView(article.Owner);
        }

        public UserView Owner { get; set; }

        public string Content { get; set; }
        
        

        public string Title { get; set; }

        public long Id { get; set; }
    }
}