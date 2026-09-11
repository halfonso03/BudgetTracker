using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;
using static Application.Core.Enums;

namespace Application.DTOs.Budgets
{
    public class ReproCategoryBalanceDto
    {
        public required int InitiativeId { get; set; }
        public required int GrantId { get; set; }
        public required int AccountId { get; set; }
        public required string AccountName { get; set; }
        public required decimal CurrentAmount { get; set; } = 0;
        public required decimal RemainingAmount { get; set; } = 0;
        public string? InitiativeName { get; set; }
        public string? GrantName { get; set; }
        public string? CategoryName { get; set; }
        public static ReproCategoryBalanceDto Create(int initiativeId, int grantId, int accountId, string name,
                decimal currentAmount, decimal remainingAmount,
                string iName = "", string gName = "", string cName = "")
        {
            return new ReproCategoryBalanceDto
            {
                InitiativeId = initiativeId,
                GrantId = grantId,
                AccountId = accountId,
                AccountName = name,
                CurrentAmount = currentAmount,
                RemainingAmount = remainingAmount,
                InitiativeName = iName,
                GrantName = gName,
                CategoryName = cName,
            };
        }
    }
}