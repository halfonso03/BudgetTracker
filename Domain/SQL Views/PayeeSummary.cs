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

        [Column("lastPaymentDate")]
        public DateTime? LastPaymentDate { get; set; }

        [Column("lastPaymentAmount")]
        public decimal? LastPaymentAmount { get; set; }

        [Column("daysSinceLastPayment")]
        public int? DaysSinceLastPayment { get; set; }

        public int? AccountId { get; set; }
        public string? AccountName { get; set; }
        public decimal? TotalPaid { get; set; }
    }
}