using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Application.DTOs.Budgets
{
    public class NewBudgetAmountDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Number { get; set; }

        [JsonPropertyName("category_id")]
        public required int CategoryId { get; set; }
        public decimal Amount { get; set; }

        [JsonPropertyName("prioryear1_amount")]
        public decimal PY1Amount { get; set; } = 0;

        [JsonPropertyName("prioryear2_amount")]
        public decimal PY2Amount { get; set; } = 0;

        public static NewBudgetAmountDto Create(
                int id, string name, int categoryId, decimal py1Amount, decimal py2Amount, string number = "")
        {
            return new NewBudgetAmountDto
            {
                Id = id,
                Name = name,
                CategoryId = categoryId,
                Number = number,
                PY1Amount = py1Amount,
                PY2Amount = py2Amount
            };
        }
    }
}