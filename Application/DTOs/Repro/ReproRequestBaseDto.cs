using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using Application.Validators;

namespace Application.DTOs.Repro
{
    public class ReproRequestBaseDto
    {
        [Required]
        public required string Justification { get; set; }

        [Required]
        public required bool Posted { get; set; }

        [Required]
        [MinLength(1, ErrorMessage = "The list must contain at least one item.")]
        public virtual List<ReproRequestLineItemDto> LineItems { get; set; } = [];

        [ValueMustBeTrueValidator(ErrorMessage = "Row Ids are not sequential")]
        public bool? SequentialRowIds
        {
            get
            {
                var assertId = 0;
                foreach (var item in LineItems)
                {
                    if (assertId != item.RowId)
                        return false;

                    assertId += 1;
                }

                return true;

            }

        }

        [ValueMustBeTrueValidator(ErrorMessage = "One or more items is duplicated.")]
        public bool? AllItemsAreDistinct
        {
            get
            {

                if (!Posted) return true;
                
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
                if (!Posted) return true;
                var inc = LineItems.Sum(x => x.Increase);
                var dec = LineItems.Sum(x => x.Decrease);
                return inc == dec;
            }
        }
    }

}