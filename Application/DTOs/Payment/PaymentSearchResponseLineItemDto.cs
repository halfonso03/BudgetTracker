using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Intrinsics.X86;
using System.Threading.Tasks;
using Microsoft.Identity.Client;

namespace Application.DTOs.Payment
{
    public class PaymentSearchResponseLineItemDto
    {
        public int PaymentId { get; internal set; }
        public required int PayeeId { get; set; }
        public required string InitiativeName { get; set; }
        public required string GrantName { get; set; }
        public required string CategoryName { get; set; }
        public required string AccountName { get; set; }
        public required string PayeeName { get; set; }
        public required decimal Amount { get; set; }
        public required int Year { get; set; }
        public string? Comment { get; set; }
        public string? InvoiceNumber { get; set; }
        public DateTime? InvoiceDate { get; set; }
        public string? CheckNumber { get; set; }
        public required int PaymentNumber { get; set; }
        public string? PostedBy { get; set; }
        public required int StatusSort { get; set; }
        public DateTime? PostedDate { get; set; }
        public int PaymentLineItemId { get; internal set; }
    }
}