using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Application.Budgets.DTOs
{
    public class BudgetLineItemDto
    {
        [JsonPropertyName("account_id")]
        public required int AccountId { get; set; }

        [JsonPropertyName("account_name")]
        public required string Name { get; set; }

        [JsonPropertyName("account_number")]
        public string AccountNumber { get; set; } = "";

        public string? Comment { get; set; }

        public required double Amount { get; set; }

        [JsonPropertyName("item_type")]
        public required string ItemType { get; set; }

        public CategoryDto? Category { get; set; } = CategoryDto.Create(1, "Personnal");

        [JsonPropertyName("category_id")]
        public required int CategoryId { get; set; }
    }
}