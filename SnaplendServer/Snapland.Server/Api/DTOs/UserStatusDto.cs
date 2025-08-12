namespace Snapland.Server.Api.DTOs
{
    /// <summary>
    /// Represents a simplified user profile with display name and active status.
    /// </summary>
    public class UserStatusDto
    {
        /// <summary>
        /// The display name of the user.
        /// </summary>
        public string DisplayName { get; set; } = string.Empty;

        /// <summary>
        /// Indicates whether the user is currently active.
        /// </summary>
        public bool IsActive { get; set; }
    }
}
