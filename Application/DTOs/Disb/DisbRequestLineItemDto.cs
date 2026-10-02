using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Disb
{
    public class DisbRequestLineItemDto
    {
        [Required]
        [Range(0, int.MaxValue)]
        public int RowId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int InitiativeId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int GrantId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int CategoryId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int AccountId { get; set; }

        [Required]
        [Range(0, 1000000)]
        public decimal Amount { get; set; }

        public string? Comment { get; set; }

        [Required]
        public int PayeeId { get; set; }

    }
}