using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Application.Budgets.DTOs
{
    public class AccountDto
    {
        public int Id { get; set; }

        public required string Name { get; set; }
        public required string Number { get; set; }

        [JsonPropertyName("category_id")]
        public required int CategoryId { get; set; }

        public static AccountDto Create(int id, string name, string number, int categoryId)
        {
            return new AccountDto
            {
                Id = id,
                Name = name,
                Number = number,
                CategoryId = categoryId
            };
        }
    }
}