using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static Application.Core.Enums;

namespace Application.DTOs.Reporting
{
    public class RunReportRequestDto
    {
        public required string Path { get; set; }
        public required int ReportId { get; set; }
        public ReportExportFormat Format { get; set; } = ReportExportFormat.EXCELOPENXML;
        public List<RunReportParameterRequestDto>? Parameters { get; set; } = [];
        public required string FileName { get; set; }
    }
}