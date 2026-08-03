using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using Application.Budgets.DTOs;
using Application.interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class BudgetController(IBudgetService _budgetService) : BaseApiController
    {
        [HttpGet("GetBudgetSummary")]
        public async Task<IActionResult> GetBudgetSummary(int year)
        {
            var summaries = await _budgetService.GetSummary(year);

            return Ok(summaries);
        }
    }
}