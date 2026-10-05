using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs.Payee
{
    public class UpdatePayeeRequestDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? AdditionalInformation { get; set; }
        public int PayeeTypeId { get; set; }
        public bool IsActive { get; set; }
        public int CategoryId { get; set; }
        public int AccountId { get; set; }
    }
}