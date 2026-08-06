using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Application.DTOs.Budgets
{
    public class InitiativeDto
    {
        public required int Id { get; set; }
        public required string Name { get; set; }

        public static InitiativeDto Create(int id, string name)
        {
            return new() { Id = id, Name = name };
        }
    }
}