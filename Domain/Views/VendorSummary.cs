using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.Views
{
    public class VendorSummary
    {
        public int Id { get; set; }
        public required string Name { get; set; }

        [Column("is_active")]
        public required bool IsActive { get; set; }
        public DateTime? LastPayment { get; set; }
        public int? DaysSinceLastPayment { get; set; }
        public int? AccountId { get; set; }
        public required string? AccountName { get; set; }
        public decimal? TotalPaid { get; set; }
    }
}