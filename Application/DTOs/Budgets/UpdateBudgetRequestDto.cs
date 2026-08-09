using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Application.Validators;
using Microsoft.Identity.Client;
using Microsoft.IdentityModel.Tokens.Experimental;

namespace Application.DTOs.Budgets
{
    public class UpdateBudgetRequestDto
    {
        [Required]
        [MinLength(1, ErrorMessage = "The list must contain at least one item.")]
        public List<BudgetLineItemRequestDto> LineItems { get; set; } = [];

        [Required]
        [DeniedValues(0)]
        public int UpdatedBy { get; set; }


        [ValueMustBeTrueValidator(ErrorMessage = "One or more items is duplicated.")]
        public bool? AllItemsAreDistinct
        {
            get
            {
                if (LineItems.Count == 0) return null;

                var itemCount = LineItems.Count;
                var distintItemCount = LineItems.Select(x => new
                {
                    x.InitiativeId,
                    x.GrantId,
                    x.AccountId
                }).Distinct().Count();

                if (itemCount == distintItemCount) return true;

                return false;
            }
        }

        [ValueMustBeTrueValidator(ErrorMessage = "All items must have an amount greater than 0.")]
        public bool? AllItemsAreGreaterThanZero
        {
            get
            {
                if (LineItems.Count == 0) return null;

                return LineItems.All(x => x.Amount > 0);
            }
        }

        [ValueMustBeTrueValidator(ErrorMessage = "All items must be for the same Grant and Initiative")]
        public bool? AllItemsAreForTheSameGrantAndInitiative
        {
            get
            {
                if (LineItems.Count == 0) return null;

                var gAndI = LineItems.Select(x => new { x.InitiativeId, x.GrantId }).First();

                foreach (var l in LineItems)
                {
                    if (l.GrantId != gAndI.GrantId || l.InitiativeId != gAndI.InitiativeId) return false;
                }

                return true;
            }
        }

    }
}