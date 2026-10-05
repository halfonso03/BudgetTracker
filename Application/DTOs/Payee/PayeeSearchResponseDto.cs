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
        public int? CategoryId { get; set; }
        public DateTime? LastPaymentDate { get; set; }
        public decimal? LastPaymentAmount { get; set; }
        public int? DaysSinceLastPayment { get; set; }
        public bool IsActive { get; set; }
        public decimal? TotalPaid { get; set; }
        public int PayeeTypeId { get; set; }
        public string? AdditionalInformation { get; set; }




        // [Column("lastPaymentDate")]
        // public DateTime? LastPaymentDate { get; set; }

        // [Column("lastPaymentAmount")]
        // public decimal? LastPaymentAmount { get; set; }



    }
}