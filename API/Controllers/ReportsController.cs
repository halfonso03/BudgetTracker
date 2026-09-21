using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.ServiceModel;
using System.Threading.Tasks;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ServiceReference;

namespace API.Controllers
{
    [Route("api/[controller]")]
    public class ReportsController(IReportService reportService) : Controller
    {
        [HttpGet("/test")]
        public async Task<IActionResult> Test()
        {
            return Ok(new { x = 1 });
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {

            var result = await reportService.RunReport("HOTTReports/UserList");

            return new FileContentResult(result, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
            {
                FileDownloadName = $"users.xlsx"
            };
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View("Error!");
        }
    }
}