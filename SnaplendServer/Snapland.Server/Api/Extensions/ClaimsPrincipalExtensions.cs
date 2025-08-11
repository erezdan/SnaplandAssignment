using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace Snapland.Server.Api.Extensions
{
    namespace Snapland.Server.Api.Extensions
    {
        public static class ClaimsPrincipalExtensions
        {
            public static Guid GetUserId(this ClaimsPrincipal user)
            {
                var sub = user.FindFirstValue(ClaimTypes.NameIdentifier)
                       ?? user.FindFirstValue(JwtRegisteredClaimNames.Sub);

                if (sub is null)
                    throw new Exception("User ID (sub) not found in JWT claims.");

                return Guid.Parse(sub);
            }
        }
    }
}
