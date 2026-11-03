using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.PaginationHelpers;

namespace Application.DTOs.Payment
{
    public class PaymentSearchResponseDto
    {
        public required List<PaymentSearchPaymentResponseDto> Items { get; set; } = [];
        public required int ItemCount { get; set; }
        public required PaginationMetadata MetaData { get; set; }
    }

    public class PaymentSearchPaymentResponseDto
    {
        public required int Id { get; set; } = 0;
        public required DateTime CreateDate { get; set; }
        public required string CreatedBy { get; set; }
        public string? PostedBy { get; set; }
        public DateTime? PostedDate { get; set; }
        public required bool Posted { get; set; }
        public string? Justification { get; set; }
        public List<PaymentSearchResponseLineItemDto>? LineItems { get; set; } = [];
        public int? Year { get; set; }
        public int StatusSort { get; set; }
        public required decimal Amount { get; set; }
    }
}