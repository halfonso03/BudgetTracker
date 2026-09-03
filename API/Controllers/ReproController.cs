using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using API.Extensions;
using Application.Core;
using Application.DTOs;
using Application.DTOs.Budgets;
using Application.DTOs.Repro;
using Application.Interfaces;
using Application.PaginationHelpers;
using Domain;
using Microsoft.AspNetCore.Authentication;
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

        [HttpPost("search")]
        public async Task<IActionResult> Search([FromBody] ReproSearchParams searchParams, [FromQuery]PaginationParams paginationParams)
        {
            var result = await _reproService.Search(searchParams, paginationParams);

            Response.AddPaginationHeader(result.Value!.MetaData);

            return HandleResult(result);
        }
    }
}