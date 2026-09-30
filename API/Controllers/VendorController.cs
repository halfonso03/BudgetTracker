using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class VendorController(VendorService vendorService) : BaseApiController
    {

        [HttpGet]
        public async Task<IActionResult> GetAllVendors()
        {
            return HandleResult(await vendorService.GetAllVendors());
        }

        [HttpGet("vendorsForAccount")]
        public async Task<IActionResult> GetVendorsForAccount(int accountId)
        {
            return HandleResult(await vendorService.GetVendorsForAccount(accountId));
        }
    }
}