using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs.Repro
{
    public class ReproSearchResponseLineItemDto
    {
        public required int RowId { get; set; }
        public required string InitiativeName { get; set; }
        public required string GrantName { get; set; }
        public required string CategoryName { get; set; }
        public required string AccountName { get; set; }
        public required decimal Increase { get; set; }
        public required decimal Decrease { get; set; }
        public required int Year { get; set; }
        public string? Comment { get; set; }
        public int ReproId { get; internal set; }
    }
}