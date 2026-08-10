using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs.Common
{
    public class CommentDto
    {
        public int Id { get; set; } = 0;
        public string Text { get; set; } = "";

        public static CommentDto Create(int id, string text)
        {
            return new CommentDto
            {
                Id = id,
                Text = text
            };
        }
    }
}