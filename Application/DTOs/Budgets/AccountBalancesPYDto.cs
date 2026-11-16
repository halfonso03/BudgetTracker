using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Application.DTOs.Common;

namespace Application.DTOs.Budgets
{
    public class AccountBalancesPYDto
    {
        [JsonPropertyName("account_id")]
        public required int AccountId { get; set; }

        public required decimal Amount { get; set; } = 0;
        public override string ToString()
        {
            return $"Budgted:  ";
        }
    }
}