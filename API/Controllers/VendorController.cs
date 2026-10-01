using API.Extensions;
using Application.DTOs.Payees;
using Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using Application.PaginationHelpers;

namespace API.Controllers
{
    [Authorize]
    public class VendorsController(PayeeService vendorService) : BaseApiController
    {
        [HttpPost("list")]
        public async Task<IActionResult> List([FromQuery] PaginationParams paginationParams, string sortBy = "NAME")
        {
            try
            {
                var vendorsFromDb = await vendorService.GetVendors(paginationParams, sortBy);

                Response.AddPaginationHeader(vendorsFromDb.Value!.MetaData);

                return HandleResult(vendorsFromDb);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        // [HttpGet("vendorsForAccount")]
        // public async Task<IActionResult> GetPayeesForAccount(int accountId)
        // {
        //     return HandleResult(await vendorService.GetPayeesForAccount(accountId));
        // }
    }
}