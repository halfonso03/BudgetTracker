using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Application.DTOs.Budgets
{
    public class AccountCurrentAmountDto
    {
        public required int AccountId { get; set; }
        public required string Name { get; set; }
        public required double CurrentAmount { get; set; } = 0;

        public static AccountCurrentAmountDto Create(int accountId, string name, double currentAmount)
        {
            return new AccountCurrentAmountDto
            {
                AccountId = accountId,
                Name = name,
                CurrentAmount = currentAmount
            };
        }
    }
}