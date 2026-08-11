using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs.Budgets
{
    public class CreateBudgetCommentRequestDto
    {
        [Required]
        public required int AccountId { get; set; }

        [Required]
        public required string Text { get; set; }
    }
}