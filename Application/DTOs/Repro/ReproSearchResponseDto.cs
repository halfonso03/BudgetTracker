using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs.Repro
{
    public class ReproSearchResponseDto
    {
        public required int Id { get; set; } = 0;
        public required DateTime CreateDate { get; set; }
        public required string CreatedBy { get; set; }
        public string? PostedBy { get; set; }
        public DateTime? PostedDate { get; set; }
        public required bool Posted { get; set; }
        public string? Justification { get; set; }
        public List<ReproSearchResponseLineItemDto>? LineItems { get; set; } = [];
        public int? Year { get; set; }

    }
}