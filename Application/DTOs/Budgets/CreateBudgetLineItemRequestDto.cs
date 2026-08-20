using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Application.DTOs.Budgets
{
    public class BudgetLineItemRequestDto
    {
        [Required]
        public required int InitiativeId { get; set; }

        [Required]
        public required int GrantId { get; set; }

        [Required]
        public required int AccountId { get; set; }

        [Required]
        public required decimal Amount { get; set; }

    }
}