using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs.Budgets
{
    public class RemainingAmountDto
    {
        public required int InitiativeId { get; set; }
        public required int GrantId { get; set; }
        public required int AccountId { get; set; }
        public required decimal Remaining { get; set; }
        public static RemainingAmountDto Create(int initiativeId, int grantId, int accountId, decimal remainingAmount
      )
        {
            return new RemainingAmountDto
            {
                InitiativeId = initiativeId,
                GrantId = grantId,
                AccountId = accountId,
                Remaining = remainingAmount,
            };
        }
    }
}