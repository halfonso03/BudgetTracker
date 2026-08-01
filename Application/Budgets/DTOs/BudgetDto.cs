using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.VisualBasic;

namespace Application.Budgets.DTOs
{
    public class BudgetDto
    {
        public int InitiativeId { get; set; }
        public int GrantId { get; set; }
        public required GrantDto Grant { get; set; }
        public required InitiativeDto Initiative { get; set; }
        public List<BudgetLineItemDto> Items { get; set; } = [];
        public int Year => Grant.StartDate.Year;
    }
}