using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs.Users
{
    // DTOs/UserDtos.cs
    public class UserListItemDto
    {
        public required int Id { get; set; }
        public required string FirstName { get; set; } = string.Empty;
        public required string LastName { get; set; } = string.Empty;
        public required string Email { get; set; } = string.Empty;
        public required DateTimeOffset? LastLoginDate { get; set; }
        public required bool IsLockoutEnabled { get; set; }
        public required  bool IsLocked { get; set; }
        public required int AccessFailedCount { get; set; }
    }
}