using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs.Users
{
    public class ResetPasswordRequestDto
    {
        public string NewPassword { get; set; } = string.Empty;
        public bool ForcePasswordChangeOnNextLogin { get; set; } = false;
    }
}