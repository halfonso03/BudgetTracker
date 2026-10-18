using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs.Budgets
{
    public class BudgetAuditResponseDto
    {
        public decimal Amount { get; set; }
        public required DateTime UpdateDate { get; set; }
        public required string UpdatedBy { get; set; }
        public required string AccountName { get; set; }
        public required string Version { get; set; }
    }
}