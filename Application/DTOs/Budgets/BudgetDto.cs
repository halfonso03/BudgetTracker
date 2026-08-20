using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Application.DTOs.Common;

namespace Application.DTOs.Budgets
{
    public class BudgetDto
    {
        [JsonPropertyName("initiative_id")]
        public int InitiativeId { get; set; }

        [JsonPropertyName("grant_id")]
        public int GrantId { get; set; }

        public required GrantDto Grant { get; set; }

        public required InitiativeDto Initiative { get; set; }

        [JsonPropertyName("account_balances")]
        public IEnumerable<AccountBalancesDto> AccountBalances { get; set; } = [];


        // [JsonPropertyName("account_balances2")]
        // public IEnumerable<AccountBalancesDto>? AccountBalances2
        // {
        //     get
        //     {
        //         if (LineItems is not null && LineItems.Any())
        //         {
        //         }
        //         return null;
        //     }
        // }



        [JsonPropertyName("line_items")]
        public IEnumerable<BudgetLineItemResponseDto> LineItems { get; set; } = [];

        public required int Year { get; set; }
    }
}