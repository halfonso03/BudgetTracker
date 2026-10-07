using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PaymentController(PaymentService paymentService) : BaseApiController
    {
        
        [HttpGet("balances")]
        public async Task<IActionResult> GetAvailableBalancesForCategory(int initiativeId, int grantId, int categoryId)
        {
            return HandleResult(await paymentService.GetAvailableBalancesForCategory(initiativeId, grantId, categoryId));
        }
    }
}