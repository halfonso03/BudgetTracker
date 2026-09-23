using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.ServiceModel;
using System.Threading.Tasks;
using Application.DTOs.Reporting;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ServiceReference;

namespace API.Controllers
{
    [Route("api/[controller]")]
    public class ReportsController(IReportService reportService) : BaseApiController
    {
        [HttpGet("{reportId}")]
        public async Task<IActionResult> Report(int reportId)
        {
            return HandleResult(await reportService.GetReport(reportId));
        }

        [HttpGet]
        public async Task<IActionResult> RunReport([FromBody] RunReportRequestDto request)
        {
            return HandleFileResult(await reportService.RunReport(request));
        }
    }
}