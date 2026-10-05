using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs.Payee
{
    public class CreatePayeeRequestDto
    {
        public required string Name { get; set; }
        public string? AdditionalInformation { get; set; }
        public required int PayeeTypeId { get; set; }
        public required bool IsActive { get; set; }
        public required int CategoryId { get; set; }
        public required int AccountId { get; set; }
    }
}