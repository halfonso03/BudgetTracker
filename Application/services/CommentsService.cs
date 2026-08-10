using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs.Common;
using Application.Interfaces;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Services
{
    public class CommentsService(AppDbContext _dbContext) : ICommentsService
    {
        public async Task<int> AddComment(CreateCommentDto commentDto)
        {
            if (commentDto.CommentType == CommentTypeEnum.Budget)
            {
                try
                {
                    var comment = new BudgetComment()
                    {
                        AccountId = commentDto.AccountId,
                        InitiativeId = commentDto.InitiativeId,
                        GrantId = commentDto.GrantId,
                        Text = commentDto.Text,
                        EntryPersonId = commentDto.UserId,
                        EntryDate = DateTime.Now,
                    };

                    _dbContext.BudgetComments.Add(comment);

                    var result = await _dbContext.SaveChangesAsync();

                    return comment.Id;
                }
                catch
                {
                    return 0;
                }
            }

            if (commentDto.CommentType == CommentTypeEnum.Reprogramming)
            {

            }

            return 0;
        }

        public async Task<int> UpdateComment(UpdateCommentDto commentDto)
        {
            if (commentDto.CommentType == CommentTypeEnum.Budget)
            {
                try
                {
                    var comment = await _dbContext.BudgetComments.FirstOrDefaultAsync(x =>
                                x.Id == commentDto.Id);

                    if (comment is not null)
                    {
                        comment.Text = commentDto.Text.Trim();
                        comment.UpdateDate = DateTime.Now;
                        comment.UpdatePersonId = commentDto.UserId;

                        await _dbContext.SaveChangesAsync();
                    }

                    return commentDto.Id;
                }
                catch
                {
                    return 0;
                }
            }

            if (commentDto.CommentType == CommentTypeEnum.Reprogramming)
            {

            }

            return 0;
        }


        // public async Task<List<CommentDto>> GetBudgetComments(int initiativeId, int grantId, int accountId)
        // {
        //     var results = await _dbContext.BudgetComments
        //                         .Where(x => x.InitiativeId == initiativeId &&
        //                             x.GrantId == grantId &&
        //                             x.AccountId == accountId)
        //                         .Select(x =>
        //                             CommentDto.Create(CommentTypeEnum.Budget, x.InitiativeId, x.GrantId, x.AccountId, x.Text, x.EntryPersonId, x.EntryDate))
        //                         .ToListAsync();

        //     return results;
        // }
    }
}