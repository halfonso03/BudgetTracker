using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.PaginationHelpers;

namespace Application.DTOs.Payee
{
    public class PaymentSearchResponseDto
    {
        public required List<PayeePaymentResponseDto> Items { get; set; } = [];
        public required int ItemCount { get; set; }
        public required PaginationMetadata MetaData { get; set; }
    }
}