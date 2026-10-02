using Application.DTOs.Disb;
using Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class DisbController(DisbService _disbService) : BaseApiController
    {
        [HttpPost]
        public async Task<IActionResult> Post(CreateDisbRequestDto disbRequestDto)
        {
            return HandleResult(await _disbService.CreateDisb(disbRequestDto));
        }

        [HttpPut]
        public async Task<IActionResult> Put(UpdateDisbRequestDto disbRequestDto)
        {
            return HandleResult(await _disbService.UpdateDisb(disbRequestDto));
        }

    }
}