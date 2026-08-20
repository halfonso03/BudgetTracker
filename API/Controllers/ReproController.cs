using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.DTOs.Budgets;
using Application.DTOs.Repro;
using Application.Interfaces;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class ReproController(IReproService _reproService) : BaseApiController
    {
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            // var budgets = await _reproService.GetBudgetsForYear(year);

            return Ok(id);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> GetAccountBalancesForCategory(int id)
        {
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateReproRequestDto reproRequestDto)
        {
            return HandleResult(await _reproService.CreateRepro(reproRequestDto));
        }
    }
}