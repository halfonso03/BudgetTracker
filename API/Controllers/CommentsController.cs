using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs.Common;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentsController(ICommentsService _commentsService) : ControllerBase
    {
        // [HttpGet("/budget/account")]
        // public async Task<IActionResult> GetBudgetCommentsForAccount(int initiativeId, int grantId, int accountId)
        // {
        //     List<CommentDto> results = await _commentsService.GetBudgetComments(initiativeId, grantId, accountId);

        //     return Ok(results);
        // }

        [HttpPost]
        public async Task<IActionResult> Add(CreateCommentDto commentDto)
        {
            int result = await _commentsService.AddComment(commentDto);

            if (result == 0) return BadRequest();

            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> Update(UpdateCommentDto commentDto)
        {
            int result = await _commentsService.UpdateComment(commentDto);

            if (result == 0) return BadRequest();

            return Ok();
        }
    }
}