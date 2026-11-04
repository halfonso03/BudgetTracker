using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs.Payment
{
    public class PaymentSearchBudgetParamResponseDto
    {
        public required int InitiativeId { get; set; }
        public required string InitiativeName { get; set; }
        public required int GrantId { get; set; }
        public required string GrantName { get; set; }
        public required int AccountId { get; set; }
        public required string AccountName { get; set; }
    }
}