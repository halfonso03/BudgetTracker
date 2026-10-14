using Application.DTOs.Payment;
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

        // [HttpPost("duplicate")]
        // public async Task<IActionResult> Duplicate([FromBody] DisbDuplicateRequestDto data)
        // {
        //     return HandleResult(await _disbService.DuplicateRepro(data.Id, data.UserId));
        // }
    }
}