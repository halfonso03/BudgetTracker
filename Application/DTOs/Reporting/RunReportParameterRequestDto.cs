using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs.Reporting
{
    public class RunReportParameterRequestDto
    {
        public required string Name { get; set; }
        public required string Value { get; set; }
    }
}