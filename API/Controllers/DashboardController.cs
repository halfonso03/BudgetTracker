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
        public async Task<IActionResult> GetBudgetSurplusBurnRateReportAsync (int hidtaId, int year)
        {
            return HandleResult(await dashboardService.GetBudgetSurplusBurnRateReportAsync(hidtaId, year));
        }
    }
}