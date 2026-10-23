using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs.Users
{
    public class ToggleLockoutRequestDto
    {
        public bool IsLocked { get; set; }
    }
}