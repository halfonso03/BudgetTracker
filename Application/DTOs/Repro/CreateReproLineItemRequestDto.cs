using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Application.DTOs.Repro
{
    public class ReproRequestLineItemDto
    {
        [Required]
        [Range(0, int.MaxValue)]
        [JsonPropertyName("row_id")]
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
        public decimal Increase { get; set; }

        [Required]
        [Range(0, 1000000)]
        public decimal Decrease { get; set; }
    }
    public class CreateReproLineItemRequestDto : ReproRequestLineItemDto
    {


    }
}