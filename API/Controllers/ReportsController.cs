
using Application.Core;
using Application.DTOs.Reporting;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

namespace API.Controllers
{
    [Route("api/[controller]")]
    public class ReportsController(IReportService reportService) : BaseApiController
    {
        [HttpGet("list")]
        public async Task<IActionResult> List()
        {
            return HandleResult(await reportService.GetAllReports());
        }

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

        [HttpGet("parameters/values/{reportId}/{parameterId}")]
        public async Task<IActionResult> GetParameterValues(int reportId, int parameterId, [FromQuery] string? selectedValue = null, [FromQuery] bool showAllOption = false)
        {
            return HandleResult(await reportService.GetParameterDataSource(reportId, parameterId, selectedValue, showAllOption));
        }
    }
}