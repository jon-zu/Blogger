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


        private static async Task<TResponse> Send<TRequest, TResponse>(HttpClient client, HttpMethod method, string uri, TRequest body)
        {
            var req = new HttpRequestMessage(method, uri);
            if (body != null)
                req.Content = JsonContent(body);

            using var resp = await client.SendAsync(req);
            Assert.AreEqual(HttpStatusCode.OK, resp.StatusCode);
            return await ParseJsonContent<TResponse>(resp.Content);
        }

        private static Task<TResponse> Post<TRequest, TResponse>(HttpClient client, string uri, TRequest body)
            => Send<TRequest, TResponse>(client, HttpMethod.Post, uri, body);

        private static Task<TResponse> Put<TRequest, TResponse>(HttpClient client, string uri, TRequest body)
            => Send<TRequest, TResponse>(client, HttpMethod.Put, uri, body);

        private static Task<TResponse> Delete<TRequest, TResponse>(HttpClient client, string uri, TRequest body)
            => Send<TRequest, TResponse>(client, HttpMethod.Delete, uri, body);


        private static Task<TResponse> Delete<TResponse>(HttpClient client, string uri)
            => Send<object, TResponse>(client, HttpMethod.Delete, uri, null);
        private static Task<TResponse> Get<TResponse>(HttpClient client, string uri)
            => Send<object, TResponse>(client, HttpMethod.Get, uri, null);

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
            var resp = await Post<LoginInputView, AuthTokenView>(client, "api/User/Login", new LoginInputView
            {
                Username = userName,
                Password = password
            });

            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", resp.Token);
        }

        [Order(1)]
        [Test]
        public async Task TestUser()
        {
            const string name = "user2";
            const string pw = "User2!!!";

            var userData = new LoginInputView
            {
                Username = name,
                Password = pw
            };

            //Check login non existent user
            using (var loginResp = await _newUserClient.PostAsync("api/User/Login", JsonContent(userData)))
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, loginResp.StatusCode);
            }

            //Create new user
            var newUserData = await Post<LoginInputView, UserView>(_newUserClient, "api/User/Register", userData);
            Assert.AreEqual(newUserData.Name, name);

            //Try login
            await SetToken(_newUserClient, name, pw);

            //Try get current user
            var curUserData = await Get<UserView>(_newUserClient, "api/User/Current");
            Assert.AreEqual(newUserData.Id, curUserData.Id);


            //Try get user by Id
            var getUserData = await Get<UserView>(_newUserClient, $"api/User/{newUserData.Id}");
            Assert.AreEqual(newUserData.Id, getUserData.Id);
        }

        [Order(2)]
        [Test]
        public async Task TestBlog()
        {
            const string title = "Dev blogger";
            const string about = "A blog about development";
            const string title2 = "new title";
            const string about2 = "new about";

            //Create blog for user
            var create = new BlogCreateView
            {
                About = about,
                Title = title
            };

            var newBlogData = await Post<BlogCreateView, BlogView>(_userClient, "/Blog", create);
            Assert.AreEqual(newBlogData.Title, title);
            Assert.AreEqual(newBlogData.About, about);


            var blogData = await Get<BlogView>(_userClient, $"api/Blog/{newBlogData.Id}");
            Assert.AreEqual(newBlogData.Id, blogData.Id);

            //Update blog
            var update = new BlogCreateView
            {
                About = about2,
                Title = title2
            };
            var id = newBlogData.Id;
            newBlogData = await Put<BlogCreateView, BlogView>(_userClient, $"api/Blog/{id}", update);

            Assert.AreEqual(id, newBlogData.Id);
            Assert.AreEqual(title2, newBlogData.Title);
            Assert.AreEqual(about2, newBlogData.About);

            //Unauthorized Update blog
            using (var resp = await _adminClient.PutAsync($"api/Blog/{newBlogData.Id}", JsonContent(update)))
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, resp.StatusCode);
            }

            //Delete Blog
            using (var resp = await _userClient.DeleteAsync($"api/Blog/{newBlogData.Id}"))
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
            using (var resp = await _userClient.GetAsync($"api/Comment/{newCommentData.Id}"))
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

            using (var resp = await _userClient.PutAsync($"api/Comment/{newCommentData.Id}", update))
            {
                Assert.AreEqual(HttpStatusCode.OK, resp.StatusCode);
                var id = newCommentData.Id;

                newCommentData = await ParseJsonContent<CommentView>(resp.Content);
                Assert.AreEqual(id, newCommentData.Id);
                Assert.AreEqual(content2, newCommentData.Content);
            }

            //Unauthorized Update comment
            using (var resp = await _adminClient.PutAsync($"api/Comment/{newCommentData.Id}", update))
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, resp.StatusCode);
            }

            //Delete Comment
            using (var resp = await _userClient.DeleteAsync($"api/Comment/{newCommentData.Id}"))
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
            using (var resp = await _userClient.GetAsync($"api/Article/{newArticleData.Id}"))
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

            using (var resp = await _userClient.PutAsync($"api/Article/{newArticleData.Id}", update))
            {
                Assert.AreEqual(HttpStatusCode.OK, resp.StatusCode);
                var id = newArticleData.Id;

                newArticleData = await ParseJsonContent<ArticleView>(resp.Content);
                Assert.AreEqual(id, newArticleData.Id);
                Assert.AreEqual(title2, newArticleData.Title);
                Assert.AreEqual(content2, newArticleData.Content);
            }

            //Unauthorized Update article
            using (var resp = await _adminClient.PutAsync($"api/Article/{newArticleData.Id}", update))
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, resp.StatusCode);
            }

            //Delete Article
            using (var resp = await _userClient.DeleteAsync($"api/Article/{newArticleData.Id}"))
            {
                Assert.AreEqual(HttpStatusCode.OK, resp.StatusCode);
            }
        }
    }
}