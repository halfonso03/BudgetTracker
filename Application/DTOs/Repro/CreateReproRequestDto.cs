using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Application.Validators;
using Microsoft.Identity.Client;

namespace Application.DTOs.Repro
{
    

    public class CreateReproRequestDto : ReproRequestBaseDto
    {
        [Required]
        [DeniedValues(0)]
        public required int CreatedById { get; set; }

        [Required]
        [MinLength(1, ErrorMessage = "The list must contain at least one item.")]
        public new List<CreateReproLineItemRequestDto> LineItems { get; set; } = [];

    }
}