using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs.Repro
{
    public class ReproBalanceResponseDto
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
        public required decimal CurrentAmount { get; set; }
        public required decimal RemainingAmount { get; set; }
        public required string AccountName { get; set; }
        public static Balance Create(int accountId, decimal cAmount, decimal rAmount, string name)
        {
            return new Balance
            {
                AccountId = accountId,
                CurrentAmount = cAmount,
                RemainingAmount = rAmount,
                AccountName = name
            };
        }
    }
}