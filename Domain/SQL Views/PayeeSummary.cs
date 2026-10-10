using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.Views
{
    public class PayeeSummary
    {
        public int Id { get; set; }
        public required string Name { get; set; }

        [Column("is_active")]
        public required bool IsActive { get; set; }
        public DateTime? LastPaymentDate { get; set; }
        public decimal? LastPaymentAmount { get; set; }
        public int? DaysSinceLastPayment { get; set; }
        public int? CategoryId { get; set; }
        public int? AccountId { get; set; }
        public string? AccountName { get; set; }
        public decimal? TotalPaid { get; set; }

        [Column("additional_information")]
        public string? AdditionalInformation { get; set; }

        [Column("payee_type_id")]
        public required int PayeeTypeId { get; set; }

        [Column("payeeType")]
        public required string PayeeType { get; set; }
    }
}