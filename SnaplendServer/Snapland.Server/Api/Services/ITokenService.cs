namespace Snapland.Server.Api.Services
{
    public interface ITokenService
    {
        string CreateToken(Guid userId, string email);
    }
}
