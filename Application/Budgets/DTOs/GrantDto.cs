using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Application.Budgets.DTOs
{
    public class GrantDto
    {
        public required int Id { get; set; }
        public required string Name { get; set; }
    }
}