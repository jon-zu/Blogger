using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Blogger.View;
using Newtonsoft.Json;
using NUnit.Framework;

namespace Blogger.Tests.Integration
{
    public class BlogControllerTest : TestingWebAppFactory<Startup>
    {
        private HttpClient _userClient;
        private HttpClient _adminClient;
        private HttpClient _newUserClient;

        private static HttpContent JsonContent<T>(T obj)
        {
            var jsonText = JsonConvert.SerializeObject(obj);
            return new StringContent(jsonText, Encoding.UTF8, "application/json");
        }

        private static async Task<T> ParseJsonContent<T>(HttpContent content)
        {
            var text = await content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<T>(text);
        }
        
        [OneTimeSetUp]
        public async Task Setup()
        {
            _userClient = CreateClient();
            _adminClient = CreateClient();
            _newUserClient = CreateClient();
            
            await SetToken(_userClient, "user", "User123!");
            await SetToken(_adminClient, "admin", "Admin123!");
        }

        private async Task SetToken(HttpClient client, string userName, string password)
        {
            using var resp = await client.PostAsync("/User/Login", JsonContent(new LoginInputView
            {
                Username = userName,
                Password = password
            }));
            Assert.AreEqual(HttpStatusCode.OK, resp.StatusCode);
            var token = await ParseJsonContent<AuthTokenView>(resp.Content);
            
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token.Token);
        }
        
        [Order(1)]
        [Test]
        public async Task TestUser()
        {
            const string name = "user2";
            const string pw = "User2!!!";
            
            var userData = JsonContent(new LoginInputView
            {
                Username = name,
                Password = pw
            });

            //Check login non existent user
            using (var loginResp = await _newUserClient.PostAsync("/User/Login", userData))
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, loginResp.StatusCode);
            }

            //Create new user
            UserView newUserData = null;
            using (var resp = await _newUserClient.PostAsync("/User/Register", userData))
            {
                Assert.AreEqual(HttpStatusCode.OK, resp.StatusCode);

                newUserData = await ParseJsonContent<UserView>(resp.Content);
                Assert.AreEqual(newUserData.Name, name);
            }

            //Try login
            await SetToken(_newUserClient, name, pw);
            
            //Try get current user
            using (var resp = await _newUserClient.GetAsync("/User/Current"))
            {
                Assert.AreEqual(HttpStatusCode.OK, resp.StatusCode);
                var curUserData = await ParseJsonContent<UserView>(resp.Content);
                Assert.AreEqual(newUserData.Id, curUserData.Id);
            }

            
            //Try get user by Id
            using (var resp = await _newUserClient.GetAsync($"/User/{newUserData.Id}"))
            {
                Assert.AreEqual(HttpStatusCode.OK, resp.StatusCode);

                var getUserData = await ParseJsonContent<UserView>(resp.Content);
                Assert.AreEqual(newUserData.Id, getUserData.Id);
            }
        }

        [Order(2)]
        [Test]
        public async Task TestBlog()
        {
            const string title = "Dev blogger";
            const string about = "A blog about development";
            const string title2 = "new title";
            const string about2 = "new about";
            BlogView newBlogData = null;
            
            //Create blog for user
            var create = JsonContent(new BlogCreateView
            {
                About = about,
                Title = title
            });
            
            using (var resp = await _userClient.PostAsync("/Blog", create))
            {
                Assert.AreEqual(HttpStatusCode.OK, resp.StatusCode);

                newBlogData = await ParseJsonContent<BlogView>(resp.Content);
                Assert.AreEqual(newBlogData.Title, title);
                Assert.AreEqual(newBlogData.About, about);
            }
            
            //Get blog
            using (var resp = await _userClient.GetAsync($"/Blog/{newBlogData.Id}"))
            {
                Assert.AreEqual(HttpStatusCode.OK, resp.StatusCode);

                var blogData = await ParseJsonContent<BlogView>(resp.Content);
                Assert.AreEqual(newBlogData.Id, blogData.Id);
            }
            
            //Update blog
            var update = JsonContent(new BlogCreateView
            {
                About = about2,
                Title = title2
            });
            
            using (var resp = await _userClient.PutAsync($"/Blog/{newBlogData.Id}", update))
            {
                Assert.AreEqual(HttpStatusCode.OK, resp.StatusCode);
                var id = newBlogData.Id;
                
                newBlogData = await ParseJsonContent<BlogView>(resp.Content);
                Assert.AreEqual(id, newBlogData.Id);
                Assert.AreEqual(title2, newBlogData.Title);
                Assert.AreEqual(about2,newBlogData.About);
            }
            
            //Unauthorized Update blog
            using (var resp = await _adminClient.PutAsync($"/Blog/{newBlogData.Id}", update))
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, resp.StatusCode);
            }

            //Delete Blog
            using (var resp = await _userClient.DeleteAsync($"/Blog/{newBlogData.Id}"))
            {
                Assert.AreEqual(HttpStatusCode.OK, resp.StatusCode);
            }
        }
        
        [Order(2)]
        [Test]
        public async Task TestComment()
        {
            const string content = "Blah";
            const string content2 = "new about";
            
            
            //ToDo: create blog
            const int blogId = 1;
            const int articleId = 1;
            CommentView newCommentData = null;
            
            //Create comment for user
            var create = JsonContent(new CommentCreateView
            {
                Content = content,
                ArticleId = articleId
            });
            
            using (var resp = await _userClient.PostAsync("/Comment", create))
            {
                Assert.AreEqual(HttpStatusCode.OK, resp.StatusCode);

                newCommentData = await ParseJsonContent<CommentView>(resp.Content);
                Assert.AreEqual(newCommentData.Content, content);
            }
            
            //Get comment
            using (var resp = await _userClient.GetAsync($"/Comment/{newCommentData.Id}"))
            {
                Assert.AreEqual(HttpStatusCode.OK, resp.StatusCode);

                var commentData = await ParseJsonContent<CommentView>(resp.Content);
                Assert.AreEqual(newCommentData.Id, commentData.Id);
            }
            
            //Update comment
            var update = JsonContent(new CommentCreateView
            {
                Content = content2,
                ArticleId = articleId
            });
            
            using (var resp = await _userClient.PutAsync($"/Comment/{newCommentData.Id}", update))
            {
                Assert.AreEqual(HttpStatusCode.OK, resp.StatusCode);
                var id = newCommentData.Id;
                
                newCommentData = await ParseJsonContent<CommentView>(resp.Content);
                Assert.AreEqual(id, newCommentData.Id);
                Assert.AreEqual(content2,newCommentData.Content);
            }
            
            //Unauthorized Update comment
            using (var resp = await _adminClient.PutAsync($"/Comment/{newCommentData.Id}", update))
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, resp.StatusCode);
            }

            //Delete Comment
            using (var resp = await _userClient.DeleteAsync($"/Comment/{newCommentData.Id}"))
            {
                Assert.AreEqual(HttpStatusCode.OK, resp.StatusCode);
            }
        }
        
        [Order(2)]
        [Test]
        public async Task TestArticle()
        {
            const string title = "Dev article";
            const string content = "Blah";
            const string title2 = "new title";
            const string content2 = "new about";
            
            
            //ToDo: create blog
            const int blogId = 1;
            ArticleView newArticleData = null;
            
            //Create article for user
            var create = JsonContent(new ArticleCreateView
            {
                Content = content,
                Title = title,
                BlogId = blogId
            });
            
            using (var resp = await _userClient.PostAsync("/Article", create))
            {
                Assert.AreEqual(HttpStatusCode.OK, resp.StatusCode);

                newArticleData = await ParseJsonContent<ArticleView>(resp.Content);
                Assert.AreEqual(newArticleData.Title, title);
                Assert.AreEqual(newArticleData.Content, content);
            }
            
            //Get article
            using (var resp = await _userClient.GetAsync($"/Article/{newArticleData.Id}"))
            {
                Assert.AreEqual(HttpStatusCode.OK, resp.StatusCode);

                var articleData = await ParseJsonContent<ArticleView>(resp.Content);
                Assert.AreEqual(newArticleData.Id, articleData.Id);
            }
            
            //Update article
            var update = JsonContent(new ArticleCreateView
            {
                Content = content2,
                Title = title2,
                BlogId = blogId
            });
            
            using (var resp = await _userClient.PutAsync($"/Article/{newArticleData.Id}", update))
            {
                Assert.AreEqual(HttpStatusCode.OK, resp.StatusCode);
                var id = newArticleData.Id;
                
                newArticleData = await ParseJsonContent<ArticleView>(resp.Content);
                Assert.AreEqual(id, newArticleData.Id);
                Assert.AreEqual(title2, newArticleData.Title);
                Assert.AreEqual(content2,newArticleData.Content);
            }
            
            //Unauthorized Update article
            using (var resp = await _adminClient.PutAsync($"/Article/{newArticleData.Id}", update))
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, resp.StatusCode);
            }

            //Delete Article
            using (var resp = await _userClient.DeleteAsync($"/Article/{newArticleData.Id}"))
            {
                Assert.AreEqual(HttpStatusCode.OK, resp.StatusCode);
            }
        }
    }
}