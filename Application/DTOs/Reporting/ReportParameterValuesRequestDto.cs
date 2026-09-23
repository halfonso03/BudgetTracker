using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs.Reporting
{
    public class ReportParameterValuesRequestDto
    {
        public int ReportId { get; set; }
        public required string ParameterName { get; set; }
    }
}