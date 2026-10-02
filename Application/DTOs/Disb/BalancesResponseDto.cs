using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs.Disb
{
    public class DisbBalanceResponseDto
    {
        public required Key1 Key { get; set; }
        public required List<Balance> Balances { get; set; }

        public class Key1
        {
            public required int InitiativeId { get; set; }
            public required int GrantId { get; set; }
            public required int CategoryId { get; set; }
        }
    }

    public class Balance
    {
        public required int AccountId { get; set; }
        public required decimal AvailableAmount { get; set; }
        public required decimal RemainingAmount { get; set; }
        public required string AccountName { get; set; }
        public static Balance Create(int accountId, decimal aAmount, decimal rAmount, string name)
        {
            return new Balance
            {
                AccountId = accountId,
                AvailableAmount = aAmount,
                RemainingAmount = rAmount,
                AccountName = name
            };
        }
    }
}