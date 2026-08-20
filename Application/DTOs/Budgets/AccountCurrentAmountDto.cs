using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Application.DTOs.Budgets
{
    public class AccountCurrentAmountDto
    {
        public required int InitiativeId { get; set; }
        public required int GrantId { get; set; }

        public required int AccountId { get; set; }
        public required string Name { get; set; }
        public required decimal CurrentAmount { get; set; } = 0;

        public static AccountCurrentAmountDto Create(int initiativeId, int grantId, int accountId, string name, decimal currentAmount)
        {
            return new AccountCurrentAmountDto
            {
                InitiativeId = initiativeId,
                GrantId = grantId,
                AccountId = accountId,
                Name = name,
                CurrentAmount = currentAmount
            };
        }
    }
}