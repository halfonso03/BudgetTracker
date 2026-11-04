using API.Extensions;
using Application.Core;
using Application.DTOs.Payment;
using Application.PaginationHelpers;
using Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PaymentController(PaymentService _paymentService) : BaseApiController
    {

        [HttpGet("balances")]
        public async Task<IActionResult> GetAvailableBalancesForCategory(int initiativeId, int grantId, int categoryId)
        {
            return HandleResult(await _paymentService.GetAvailableBalancesForCategory(initiativeId, grantId, categoryId));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            return HandleResult(await _paymentService.GetPayment(id));
        }

        [HttpPost]
        public async Task<IActionResult> Post(CreatePaymentRequestDto paymentRequestDto)
        {
            return HandleResult(await _paymentService.CreatePayment(paymentRequestDto));
        }

        [HttpPut]
        public async Task<IActionResult> Put(UpdatePaymentRequestDto paymentRequestDto)
        {
            return HandleResult(await _paymentService.UpdatePayment(paymentRequestDto));
        }

        [HttpPost("duplicate")]
        public async Task<IActionResult> Duplicate([FromBody] PaymentDuplicateRequestDto data)
        {
            return HandleResult(await _paymentService.DuplicatePayment(data.Id, data.UserId));
        }


        [HttpPut("invoice")]
        public async Task<IActionResult> Invoice([FromBody] UpdateInvoiceRequestDto updateInvoiceRequestDto)
        {
            return HandleResult(await _paymentService.UpdateInvoice(updateInvoiceRequestDto));
        }

        [HttpPost("search")]
        public async Task<IActionResult> Search([FromBody] PaymentSearchParams searchParams, [FromQuery] PaginationParams paginationParams, [FromQuery] string sortBy)
        {
            var result = await _paymentService.Search(searchParams, paginationParams, sortBy);

            Response.AddPaginationHeader(result.Value!.MetaData);

            return HandleResult(result);
        }


        [HttpGet("search/budgets")]
        public async Task<IActionResult> GetBudgets([FromQuery] int year)
        {
            return HandleResult(await _paymentService.GetBudgetsForSearch(year));
        }
    }
}