using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs.Payment
{
    public class PaymentCategoryBalanceDto
    {
        public required int InitiativeId { get; set; }
        public required int GrantId { get; set; }
        public required int AccountId { get; set; }
        public required string AccountName { get; set; }
        public required decimal AvailableAmount { get; set; } = 0;
        public string? InitiativeName { get; set; }
        public string? GrantName { get; set; }
        public string? CategoryName { get; set; }
        public static PaymentCategoryBalanceDto Create(int initiativeId, int grantId, int accountId, string name,
                decimal availableAmount,
                string iName = "", string gName = "", string cName = "")
        {
            return new PaymentCategoryBalanceDto
            {
                InitiativeId = initiativeId,
                GrantId = grantId,
                AccountId = accountId,
                AccountName = name,
                AvailableAmount = availableAmount,
                InitiativeName = iName,
                GrantName = gName,
                CategoryName = cName,
            };
        }
    }
}