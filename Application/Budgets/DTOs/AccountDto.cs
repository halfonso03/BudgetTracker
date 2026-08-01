using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Application.Budgets.DTOs
{
    public class BudgetLineItemDto
    {
        public required int AccountId { get; set; }
        public required string Name { get; set; }
        public string? Comment { get; set; }
        public required double Amount { get; set; }

        [JsonPropertyName("item_type")]
        public required string ItemType { get; set; }
    }
}