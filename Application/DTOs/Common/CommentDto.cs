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

        public required DateTime EntryDate { get; set; }
        public required string EnteredBy { get; set; }

        public DateTime? UpdateDate { get; set; }
        public string? UpdatedBy { get; set; }

        public static CommentDto Create(int id, string text, DateTime entryDate, string entryPerson, DateTime? updateDate = null, string? updatedBy = null)
        {
            return new CommentDto
            {
                Id = id,
                Text = text,
                EntryDate = entryDate,
                EnteredBy = entryPerson,
                UpdateDate = updateDate,
                UpdatedBy = updatedBy
            };
        }
    }
}