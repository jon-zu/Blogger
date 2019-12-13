using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Blogger.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Blogger
{
    public class Seeder
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            var ctx = serviceProvider.GetRequiredService<BlogContext>();
            var userManager = serviceProvider.GetRequiredService<UserManager<User>>();

            await ctx.Database.EnsureCreatedAsync();
            if(!ctx.Users.Any())
            {
                var user = new User
                {
                    Email = "Test@test.com",
                    SecurityStamp = Guid.NewGuid().ToString(),
                    UserName = "user"
                };
                await userManager.CreateAsync(user, "User123!");
                
                var admin = new User
                {
                    Email = "Test@test.com",
                    SecurityStamp = Guid.NewGuid().ToString(),
                    UserName = "admin"
                };
                
                await userManager.CreateAsync(admin, "Admin123!");

                user.Blogs = new List<Blog>
                {
                    new Blog
                    {
                        Owner = user,
                        About = "Some dev things",
                        Title = "Dev Blog",
                        Articles = new List<Article>()
                    }
                };

                await ctx.SaveChangesAsync();

                var blog = user.Blogs.First();
                blog.Articles.Add(new Article
                {
                    Content = "About C# and stuff",
                    Owner = user,
                    Title = "How to see sharp"
                });
                await ctx.SaveChangesAsync();

            }
        }
    }
}