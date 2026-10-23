using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs.Users
{
    // DTOs/UserDtos.cs
    public class UserListItemDto
    {
        public int Id { get; set; } 
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTimeOffset? LastLoginDate { get; set; }
        public bool IsLockoutEnabled { get; set; }
        public int AccessFailedCount { get; set; }
    }
}