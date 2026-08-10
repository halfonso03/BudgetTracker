using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs.Common;

namespace Application.Interfaces
{
    public interface ICommentsService
    {
        Task<int> AddComment(CreateCommentDto commentDto);
        // Task<List<CommentDto>> GetBudgetComments(int initiativeId, int grantId, int accountId);
        Task<int> UpdateComment(UpdateCommentDto commentDto);
    }
}