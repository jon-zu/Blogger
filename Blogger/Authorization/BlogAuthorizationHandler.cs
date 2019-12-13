using System.Security.Claims;
using System.Threading.Tasks;
using Blogger.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;

namespace Blogger.Authorization
{
    public class BlogAuthorizationHandler :
        AuthorizationHandler<OperationAuthorizationRequirement, OwnedEntity>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, OperationAuthorizationRequirement requirement,
            OwnedEntity resource)
        {
            var user = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            switch (requirement.Name)
            {
                case nameof(Operations.Update) when user == resource.OwnerId:
                    context.Succeed(requirement);
                    break;
                case nameof(Operations.Delete) when user == resource.OwnerId:
                    context.Succeed(requirement);
                    break;
                case nameof(Operations.Read):
                    context.Succeed(requirement);
                    break;
                default:
                    context.Fail();
                    break;
            }

            return Task.CompletedTask;
        }
    }
}