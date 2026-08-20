using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Application.Validators;
using Microsoft.Identity.Client;

namespace Application.DTOs.Repro
{
    public class CreateReproRequestDto
    {
        [Required]
        public required string Justification { get; set; }

        [Required]
        [DeniedValues(0)]
        public required int CreatedBy { get; set; }

        [Required]
        public required bool Posted { get; set; }

        public int? PostedBy { get; set; }

        [Required]
        [MinLength(1, ErrorMessage = "The list must contain at least one item.")]
        public List<CreateReproLineItemRequestDto> LineItems { get; set; } = [];

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

        [ValueMustBeTrueValidator(ErrorMessage = "Reprogramming has a variance.")]
        public bool? MustBalance
        {
            get
            {
                var inc = LineItems.Sum(x => x.Increase);
                var dec = LineItems.Sum(x => x.Decrease);
                if (Posted) return inc == dec;
                return true;
            }
        }
    }
}