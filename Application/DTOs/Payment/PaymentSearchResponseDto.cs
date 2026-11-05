using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.PaginationHelpers;

namespace Application.DTOs.Payment
{
    public class PaymentSearchResponseDto
    {
        public required List<PaymentSearchResponseLineItemDto> Items { get; set; } = [];
        public required int ItemCount { get; set; }
        public required PaginationMetadata MetaData { get; set; }
    }
}