using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Application.DTOs.Budgets
{
    public class BudgetLineItemRequestDto
    {
        public required int InitiativeId { get; set; }

        public required int GrantId { get; set; }

        public required int AccountId { get; set; }

        public required double Amount { get; set; }

    }
}