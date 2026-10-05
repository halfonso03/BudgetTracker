using API.Extensions;
using Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Application.PaginationHelpers;
using Application.DTOs.Payee;
using Application.Core;

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

        [HttpGet("payments")]
        public async Task<IActionResult> Payments(int payeeId, [FromQuery] PaginationParams paginationParams, string sortBy = "ID")
        {
            try
            {
                var payments = await payeeService.GetPayeePayments(payeeId, paginationParams, sortBy);

                Response.AddPaginationHeader(payments.Value!.MetaData);

                return HandleResult(payments);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("payment_stats")]
        public async Task<IActionResult> Payments(int payeeId)
        {
            try
            {
                return HandleResult(await payeeService.GetPayeePaymentSummary(payeeId));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreatePayee([FromBody] CreatePayeeRequestDto createPayeeRequestDto)
        {
            try
            {
                return HandleResult(await payeeService.CreatePayee(createPayeeRequestDto));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPut]
        public async Task<IActionResult> UpdatePayee([FromBody] UpdatePayeeRequestDto updatePayeeRequestDto)
        {
            try
            {
                return HandleResult(await payeeService.UpdatePayee(updatePayeeRequestDto));
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