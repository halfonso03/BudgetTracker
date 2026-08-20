using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs.Repro
{
    public class ReproDto
    {
        public required int Id { get; set; } = 0;
        public required DateTime CreateDate { get; set; }
        public string? PostedBy { get; set; }
        public DateTime? PostedDate { get; set; }
        public List<ReproLineItemDto> LineItems { get; set; } = [];
    }
}