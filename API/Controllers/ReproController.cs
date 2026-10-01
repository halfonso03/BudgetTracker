using API.Extensions;
using Application.DTOs;
using Application.DTOs.Repro;
using Application.Interfaces;
using Application.PaginationHelpers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ReproController(IReproService _reproService) : BaseApiController
    {
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            return HandleResult(await _reproService.GetRepro(id));
        }

        [HttpPut]
        public async Task<IActionResult> Put(UpdateReproRequestDto reproRequestDto)
        {
            return HandleResult(await _reproService.UpdateRepro(reproRequestDto));
        }

        [HttpPost]
        public async Task<IActionResult> Post(CreateReproRequestDto reproRequestDto)
        {
            return HandleResult(await _reproService.CreateRepro(reproRequestDto));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return HandleResult(await _reproService.DeleteRepro(id));
        }

        [HttpPost("search")]
        public async Task<IActionResult> Search([FromBody] ReproSearchParams searchParams, [FromQuery] PaginationParams paginationParams, [FromQuery] string sortBy)
        {
            var result = await _reproService.Search(searchParams, paginationParams, sortBy);

            Response.AddPaginationHeader(result.Value!.MetaData);

            return HandleResult(result);
        }

        [HttpPost("duplicate")]
        public async Task<IActionResult> Duplicate([FromBody] ReproDuplicateRequestDto data)
        {
            return HandleResult(await _reproService.DuplicateRepro(data.Id, data.UserId));
        }
    }
}