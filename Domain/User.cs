using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class ApplicationUser : IdentityUser<int>
    {
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
    }

    public class ApplicationRole : IdentityRole<int>
    {
        // Add custom role properties here if needed
    }
}