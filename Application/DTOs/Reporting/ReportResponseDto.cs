using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs.Reporting
{
    public class ReportResponseDto
    {
        public int Id { get; set; }

        public required string Name { get; set; }

        public required string Path { get; set; }

        public required byte CategoryId { get; set; }

        public required bool Enabled { get; set; }
        public List<ReportParameterResponseDto>? Parameters { get; set; } = [];
        // public required ReportCategory Category { get; set; }

        public static ReportResponseDto Create(byte id, string name, string path, List<Domain.ReportParameter>? parameters = null)
        {
            return new ReportResponseDto
            {
                Id = id,
                Name = name,
                Path = path,
                CategoryId = 0,
                Enabled = true,
                Parameters = parameters != null 
                    ? [.. parameters.Select(x => ReportParameterResponseDto.Create(x.Id, x.SortOrder, x.Name, x.ReportId, x.Label))] 
                    : null
            };
        }
    }
}