using System;

namespace Blogger.View
{
    public class AuthTokenView
    {
        public string Token { get; set; }
        public DateTime Expiration { get; set; }
    }
}