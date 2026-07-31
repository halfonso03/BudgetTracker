using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Budgets.DTOs
{
    public class BudgetDto
    {
        public int InitiativeId { get; set; }
        public int GrantId { get; set; }
        public int Year { get; set; }

        public required GrantDto Grant { get; set; }
        public required InitiativeDto Initiative { get; set; }

        public required List<AccountDto> Accounts { get; set; } = [];
    }
}