using Application.DTOs.Disb;
using Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class DisbController(DisbService _disbService) : BaseApiController
    {

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            return HandleResult(await _disbService.GetDisb(id));
        }

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

        // [HttpPost("duplicate")]
        // public async Task<IActionResult> Duplicate([FromBody] DisbDuplicateRequestDto data)
        // {
        //     return HandleResult(await _disbService.DuplicateRepro(data.Id, data.UserId));
        // }
    }
}