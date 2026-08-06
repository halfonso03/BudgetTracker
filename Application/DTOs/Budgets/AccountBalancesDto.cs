using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Application.DTOs.Budgets
{
    public class AccountBalancesDto
    {
        [JsonPropertyName("account_id")]
        public required int AccountId { get; set; }

        [JsonPropertyName("account_name")]
        public required string Name { get; set; }

        [JsonPropertyName("account_number")]
        public string? AccountNumber { get; set; }

        public string? Comment { get; set; }

        public required double Amount { get; set; } = 0;

        [JsonPropertyName("current_amount")]
        public required double CurrentAmount { get; set; } = 0;

        [JsonPropertyName("spent_amount")]
        public required double SpentAmount { get; set; } = 0;

        public CategoryDto? Category { get; set; } = null;

        [JsonPropertyName("category_id")]
        public required int CategoryId { get; set; }

        [JsonPropertyName("comment_count")]
        public int CommentCount { get; set; } = 0;


        public override string ToString()
        {
            return $"{Name} - Budgted: ${Amount} Current: {CurrentAmount} Spent: {SpentAmount} ";
        }
    }
}