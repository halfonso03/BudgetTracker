using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using Domain;

namespace Application.DTOs.Budgets
{
    public class CategoryDto
    {
        public required int Id { get; set; }
        public required string Name { get; set; }

        public List<AccountDto> Accounts { get; set; } = [];

        public static CategoryDto Create(int id, string name)
        {
            return new CategoryDto
            {
                Id = id,
                Name = name
            };
        }

        public static CategoryDto Create(int id, string name, List<AccountDto> accountDtos)
        {
            return new CategoryDto
            {
                Id = id,
                Name = name,
                Accounts = accountDtos
            };
        }

        public static CategoryDto CreateFromDomain(Category? category)
        {
            if (category is null) throw new Exception();

            return Create(category.Id, category.Name);
        }

    }
}