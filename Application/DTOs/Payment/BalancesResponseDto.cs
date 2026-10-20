using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs.Payment
{
    public class PaymentBalanceResponseDto
    {
        public required int InitiativeId { get; set; }
        public required int GrantId { get; set; }
        public required int CategoryId { get; set; }
        public required int AccountId { get; set; }
        public required decimal RemainingAmount { get; set; }
        public required string AccountName { get; set; }
    }

    // public class Balance
    // {
    //     public required int AccountId { get; set; }
    //     public required decimal RemainingAmount { get; set; }
    //     public required string AccountName { get; set; }
    //     public static Balance Create(int accountId, decimal rAmount, string name)
    //     {
    //         return new Balance
    //         {
    //             AccountId = accountId,
    //             RemainingAmount = rAmount,
    //             AccountName = name
    //         };
    //     }
    // }
}