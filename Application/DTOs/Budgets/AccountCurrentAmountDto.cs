using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;

namespace Application.DTOs.Budgets
{
    public class AccountCurrentAmountDto
    {
        public required int InitiativeId { get; set; }
        public required int GrantId { get; set; }
        public required int AccountId { get; set; }
        public required string Name { get; set; }
        public required decimal CurrentAmount { get; set; } = 0;
        public string? InitiativeName { get; set; }
        public string? GrantName { get; set; }
        public string? CategoryName { get; set; }
        public static AccountCurrentAmountDto Create(int initiativeId, int grantId, int accountId, string name, decimal currentAmount,
        string iName = "", string gName = "", string cName = "")
        {
            return new AccountCurrentAmountDto
            {
                InitiativeId = initiativeId,
                GrantId = grantId,
                AccountId = accountId,
                Name = name,
                CurrentAmount = currentAmount,
                InitiativeName = iName,
                GrantName = gName,
                CategoryName = cName
            };
        }
    }
}