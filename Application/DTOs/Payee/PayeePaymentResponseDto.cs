using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs.Payee
{
    public class PayeePaymentResponseDto
    {
        public int Id { get; set; }
        public int Year { get; set; }
        public DateTime PostedDate { get; set; }
        public required string Initiative { get; set; }
        public required string Grant { get; set; }
        public decimal Amount { get; set; }
        public required string PostedBy { get; set; }
    }
}