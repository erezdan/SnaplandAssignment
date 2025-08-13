using Microsoft.EntityFrameworkCore;
using Snapland.Server.Api.DTOs;
using Snapland.Server.Infrastructure.Persistence;

public class UserCacheService
{
    private readonly AppDbContext _db;
    private readonly List<UserStatusDto> _cachedUsers = new();
    private readonly object _lock = new();

    public UserCacheService(AppDbContext db)
    {
        _db = db;
    }

    public async Task LoadInitialUsersAsync()
    {
        var users = await _db.Users
            .Select(u => new UserStatusDto
            {
                Id = u.Id,
                DisplayName = u.DisplayName,
                IsActive = u.IsActive
            })
            .ToListAsync();

        lock (_lock)
        {
            _cachedUsers.Clear();
            _cachedUsers.AddRange(users);
        }
    }

    public void UpdateUserStatus(Guid userId, bool isActive)
    {
        lock (_lock)
        {
            var user = _cachedUsers.FirstOrDefault(u => u.Id == userId);
            if (user != null)
                user.IsActive = isActive;
        }
    }

    public List<UserStatusDto> GetActiveUsers(Guid? excludeUserId = null)
    {
        lock (_lock)
        {
            return _cachedUsers
                .Where(u => u.IsActive && (excludeUserId == null || u.Id != excludeUserId))
                .ToList();
        }
    }
}
