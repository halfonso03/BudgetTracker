using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.VisualBasic;

namespace Application.Budgets.DTOs
{
    public class BudgetDto
    {

        [JsonPropertyName("initiative_id")]
        public int InitiativeId { get; set; }

        [JsonPropertyName("grant_id")]
        public int GrantId { get; set; }
        public required GrantDto Grant { get; set; }
        public required InitiativeDto Initiative { get; set; }
        public IEnumerable<BudgetLineItemDto> Items { get; set; } = [];
        public required int Year { get; set; }
    }
}