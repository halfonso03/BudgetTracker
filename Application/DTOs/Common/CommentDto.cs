using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs.Common
{
    public class CommentDto
    {
        public CommentTypeEnum CommentType { get; set; }
        public required int InitiativeId { get; set; }
        public required int GrantId { get; set; }
        public required int AccountId { get; set; }
        public required string Text { get; set; }
        public required int UserId { get; set; }
        public DateTime? EntryDate { get; set; }
        public static CommentDto Create(CommentTypeEnum commentType, int initiativeId, int grantId, int accountId, string text, int userId, DateTime? entryDate = null)
        {
            return new CommentDto()
            {
                CommentType = commentType,
                InitiativeId = initiativeId,
                GrantId = grantId,
                AccountId = accountId,
                Text = text,
                UserId = userId,
                EntryDate = entryDate
            };
        }
    }
}