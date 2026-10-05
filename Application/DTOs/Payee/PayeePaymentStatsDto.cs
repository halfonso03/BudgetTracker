using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs.Payee
{
    public class PayeePaymentStatsDto
    {
        public decimal? LowestPayment { get; set; } = null;
        public decimal? HighestPayment { get; set; } = null;
        public decimal? AveragePayment { get; set; } = null;
        public DateTime? LastPaymentDate { get; set; } = null;
        public decimal? LastPaymentAmount { get; set; } =null;
    }
}