using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.DTOs.Budgets;
using Application.DTOs.Disb;
using Application.Interfaces;
using Application.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;
using static Application.Core.Enums;

namespace API.Controllers
{
    public class DisbController(DisbService _disbService) : BaseApiController
    {

        [HttpPost]
        [HttpPost]
        public async Task<IActionResult> Post(CreateDisbRequestDto disbRequestDto)
        {
            return HandleResult(await _disbService.CreateDisb(disbRequestDto));
        }
    }
}