using System.ComponentModel.DataAnnotations;
using Application.Validators;
using Domain;

namespace Application.DTOs.Disb
{
    public class DisbRequestBaseDto
    {
        [Required]
        public required string Justification { get; set; }

        [Required]
        public required bool Posted { get; set; }

        public List<DisbLineItem> LineItems { get; set; } = [];

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
    }
}