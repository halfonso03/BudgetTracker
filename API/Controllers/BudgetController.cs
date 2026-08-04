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
            var budgets = await _budgetService.GetBudgets(year);

            return Ok(budgets);
        }

        [HttpGet("GetBudget")]
        public async Task<IActionResult> GetBudget(int initiativeId, int grantId)
        {
            var budgets = await _budgetService.GetBudget(initiativeId, grantId);

            return Ok(budgets);
        }
    }
}