using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Application.DTOs.Budgets
{
    public class AccountDto
    {
        public int Id { get; set; }

        public required string Name { get; set; }
        public string? Number { get; set; }

        [JsonPropertyName("category_id")]
        public required int CategoryId { get; set; }

        public static AccountDto Create(int id, string name, int categoryId, string number = "")
        {
            return new AccountDto
            {
                Id = id,
                Name = name,
                CategoryId = categoryId,
                Number = number,
            };
        }
    }
}