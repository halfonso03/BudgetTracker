using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.DTOs.Budgets;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class BudgetController(IBudgetService _budgetService) : BaseApiController
    {
        [HttpGet("GetBudgetsForYear")]
        public async Task<IActionResult> GetBudgetsForYear(int year)
        {
            var budgets = await _budgetService.GetBudgetsForYear(year);

            return Ok(budgets);
        }

        [HttpGet("GetBudget")]
        public async Task<IActionResult> GetBudget(int initiativeId, int grantId)
        {
            return Ok(await _budgetService.GetBudget(initiativeId, grantId));
        }

        [HttpGet("balances")]
        public async Task<IActionResult> GetAccountBalancesForCategory(int initiativeId, int grantId, int categoryId)
        {
            return Ok(await _budgetService.GetAccountBalancesForCategory(initiativeId, grantId, categoryId));
        }

        [HttpPost]
        public async Task<IActionResult> CreateBudget(CreateBudgetRequestDto createBudgetDto)
        {
            return HandleResult(await _budgetService.CreateBudget(createBudgetDto));
        }


        [HttpPut]
        public async Task<IActionResult> UpdateBudget(UpdateBudgetRequestDto updateBudgetDto)
        {
            return HandleResult(await _budgetService.UpdateBudget(updateBudgetDto));
        }
    }
}