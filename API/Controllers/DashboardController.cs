using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;
using Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class DashboardController (DashboardService dashboardService) : BaseApiController
    {
        [HttpGet("BudgetSurplusBurnRateReport")]
        public async Task<IActionResult> GetBudgetSurplusBurnRateReport([FromQuery] int hidtaId = 0, [FromQuery] int year = 0)
        {
            return HandleResult(await dashboardService.GetBudgetSurplusBurnRateReportAsync(hidtaId, year));
        }

        [HttpGet("BudgetSurplusBurnRateReportByAccount")]
        public async Task<IActionResult> GetBudgetSurplusBurnRateReportbyAccount([FromQuery] int initiativeId = 0, [FromQuery] int grantId = 0)
        {

            var result = await dashboardService.GetBudgetSurplusBurnRateReportbyAccountAsync(initiativeId, grantId);
            
            return HandleResult(result);
        }
        
    }
}