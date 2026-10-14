using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Identity.Client;

namespace Application.DTOs.Payment
{
    public class PaymentDuplicateRequestDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        public override string ToString()
        {
            return Id.ToString() + " " + UserId.ToString();
        }
    }
}