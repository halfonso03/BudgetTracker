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
using static Application.Core.Enums;

namespace API.Controllers
{
    public class DisbController(IDisbService _disbService) : BaseApiController
    {
        [HttpGet("GetLineItemsForAccount")]
        public async Task<IActionResult> GetLineItemsForAccount(int initiativeId, int grantId, int accountId)
        {
            var disbs = await _disbService.GetLineItemsForAccount(initiativeId, grantId, accountId);

            return Ok(disbs);
        }

        // [HttpGet("GetLineItemsForAccount/{transactionType:int}")]
        // public async Task<IActionResult> GetLineItemsForAccount(TransactionType transactionType, int initiativeId, int grantId, int accountId)
        // {
        //     List<TransactionResponseDto> budgets = await _disbService.GetLineItemsForAccount(transactionType, initiativeId, grantId, accountId);

        //     return Ok(budgets);
        // }
    }
}