using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Application.DTOs.Budgets
{
    public class CreateBudgetLineItemRequestDto
    {
        [JsonPropertyName("initiative_Id")]
        public required int InitiativeId { get; set; }

        [JsonPropertyName("grant_id")]
        public required int grant_id { get; set; }
    }
}