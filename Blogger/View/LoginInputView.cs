using System.ComponentModel.DataAnnotations;

namespace Blogger.View
{
    public class LoginInputView
    {
        [Required(ErrorMessage = "Username is required")]
        public string  Username { get; set; }
        
        [Required(ErrorMessage = "Password is required")]
        public string  Password { get; set; }
    }
}