using API.Extensions;
using Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Application.PaginationHelpers;
using Application.DTOs.Payee;
using Application.Core;
using Application.DTOs.Payees;

namespace API.Controllers
{
    public class PayeeController(PayeeService payeeService) : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> List(int payeeId)
        {
            try
            {
                return HandleResult(await payeeService.GetPayee(payeeId));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search(string filter)
        {
            var payeesFromDb = await payeeService.GetPayees(new PaginationParams
            {
                PageSize = 10000,
                PageNumber = 1
            }, filter);


            if (payeesFromDb.Value != null)
            {
                return Ok(payeesFromDb.Value.Items);
            }
            else
            {
                return Ok(new List<PayeeSearchPayeeResponseDto>());
            }
        }

        [HttpGet("list")]
        public async Task<IActionResult> List([FromQuery] PaginationParams paginationParams, string searchTerm = "", string sortBy = "NAME", int year = 0)
        {
            try
            {
                var payeesFromDb = await payeeService.GetPayees(paginationParams, searchTerm, sortBy, year);

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

        [HttpGet("invoices/{payeeId}")]
        public async Task<IActionResult> Invoices(int payeeId, [FromQuery] string invoiceNumber)
        {
            var invoices = await payeeService.GetPayeeInvoices(payeeId, invoiceNumber);

            return HandleResult(invoices);
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