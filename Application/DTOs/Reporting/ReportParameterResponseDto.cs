using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs.Reporting
{
    public class ReportParameterResponseDto
    {
        public int Id { get; set; }

        public required byte SortOrder { get; set; }

        public required string Name { get; set; }

        public required string Label { get; set; }

        public required int ReportId { get; set; }

        public static ReportParameterResponseDto Create(int id, byte sortOrder, string name, int reportId, string label)
        {
            return new ReportParameterResponseDto
            {
                Id = id,
                Name = name,
                SortOrder = sortOrder,
                ReportId = reportId,
                Label = label
            };
        }
    }
}