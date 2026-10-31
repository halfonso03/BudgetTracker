using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs.Payment
{
    public class UpdateInvoiceRequestDto
    {
        [Required]
        public int PaymentLineId { get; set; }

        [MaxLength(100)]
        public string? InvoiceNumber { get; set; }
        public DateTime? InvoiceDate { get; set; }

        [MaxLength(100)]
        public string? CheckNumber { get; set; }

    }
}