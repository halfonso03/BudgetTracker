using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Budgets.DTOs
{
    public class CategoryDto
    {
        public required int Id { get; set; }
        public required string Name { get; set; }

        public static CategoryDto Create(int id, string name)
        {
            return new CategoryDto
            {
                Id = id,
                Name = name
            };
        }
    }
}