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
            return HandleResult(await _reproService.GetRepro(id));
        }

        [HttpPut]
        public async Task<IActionResult> Put(UpdateReproRequestDto reproRequestDto)
        {
            return HandleResult(await _reproService.UpdateRepro(reproRequestDto));
        }

        [HttpPost]
        public async Task<IActionResult> Post(CreateReproRequestDto reproRequestDto)
        {
            return HandleResult(await _reproService.CreateRepro(reproRequestDto));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return HandleResult(await _reproService.DeleteRepro(id));
        }
    }
}