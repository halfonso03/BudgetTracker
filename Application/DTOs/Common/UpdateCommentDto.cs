using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Identity.Client;

namespace Application.DTOs.Common
{
    public class UpdateCommentDto
    {
        public CommentTypeEnum CommentType { get; set; }
        public required int Id { get; set; }
        public required int UserId { get; set; }
        public required string Text { get; set; }

    }
}