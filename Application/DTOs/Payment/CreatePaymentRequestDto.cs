using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs.Payment
{
    public class CreatePaymentRequestDto : PaymentRequestBaseDto
    {
        [Required]
        [DeniedValues(0)]
        public required int CreatedById { get; set; }
    }
}