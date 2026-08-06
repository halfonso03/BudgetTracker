using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;

namespace Application.DTOs.Budgets
{
    public class BudgetLineItemDto
    {
        public required int InitiativeId { get; set; }
        public required int GrantId { get; set; }

        [JsonPropertyName("account_id")]
        public required int AccountId { get; set; }

        [JsonPropertyName("account_name")]
        public required string Name { get; set; }

        [JsonPropertyName("account_number")]
        public string? AccountNumber { get; set; }

        // public string? Comment { get; set; }

        public required double Amount { get; set; } = 0;

        [JsonPropertyName("item_type")]
        public required string ItemType { get; set; }

        public CategoryDto? Category { get; set; } = null;

        [JsonPropertyName("category_id")]
        public required int CategoryId { get; set; }

        public static BudgetLineItemDto Create(int grantId, int initiativeId, int accountId, string name, double amount, int categoryId, string itemType, string comment = "", string accountNumber = "", CategoryDto? category = null)
        {
            return new BudgetLineItemDto
            {
                GrantId = grantId,
                InitiativeId = initiativeId,
                AccountId = accountId,
                Amount = amount,
                CategoryId = categoryId,
                ItemType = itemType,
                AccountNumber = accountNumber,
                Name = name,
                Category = category != null ? CategoryDto.Create(category.Id, category.Name) : null
            };
        }


    }
}
