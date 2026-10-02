using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Threading.Tasks;
using Application.PaginationHelpers;

namespace Application.DTOs.Payees
{
    public class PayeeSearchResponseDto
    {
        public required List<PayeeSearchPayeeResponseDto> Items { get; set; } = [];
        public required int ItemCount { get; set; }
        public required PaginationMetadata MetaData { get; set; }
    }

    public class PayeeSearchPayeeResponseDto
    {
        public required int Id { get; set; } = 0;
        public required string Name { get; set; }
        public string? AccountName { get; set; }
        public int? AccountId { get; set; }
        public DateTime? LastPayment { get; set; }
        public int? DaysSinceLastPayment { get; set; }
        public bool IsActive { get; set; }
        public decimal? TotalPaid { get; set; }
    }
}