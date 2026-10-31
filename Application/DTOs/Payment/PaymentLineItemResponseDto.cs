using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Identity.Client;

namespace Application.DTOs.Payment
{
    public class PaymentLineItemResponseDto
    {
        public required int RowId { get; set; }

        public required int InitiativeId { get; set; }
        public required string InitiativeName { get; set; }

        public required int GrantId { get; set; }
        public required string GrantName { get; set; }

        public required int CategoryId { get; set; }
        public required string CategoryName { get; set; }

        public required int AccountId { get; set; }
        public required string AccountName { get; set; }
        public required string PayeeName { get; set; }
        public required int PayeeId { get; set; }
        public required decimal PaymentAmount { get; set; }
        public required int Year { get; set; }
        public string? Comment { get; set; }

        public string? InvoiceNumber { get; set; }
        public DateTime? InvoiceDate { get; set; }
        public string? CheckNumber { get; set; }

        public DateTime? LastPaymentDate { get; set; }
        public bool? OverrideNegativeBalance { get; set; }
    }
}