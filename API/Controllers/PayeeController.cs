using API.Extensions;
using Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Application.PaginationHelpers;

namespace API.Controllers
{
    public class PayeeController(PayeeService payeeService) : BaseApiController
    {
        [HttpGet("list")]
        public async Task<IActionResult> List([FromQuery] PaginationParams paginationParams, string searchTerm = "", string sortBy = "NAME")
        {
            try
            {
                var payeesFromDb = await payeeService.GetPayees(paginationParams, searchTerm, sortBy);

                Response.AddPaginationHeader(payeesFromDb.Value!.MetaData);

                return HandleResult(payeesFromDb);
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