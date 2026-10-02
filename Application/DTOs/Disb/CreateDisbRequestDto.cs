using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs.Disb
{
    public class CreateDisbRequestDto : DisbRequestBaseDto
    {
        [Required]
        [DeniedValues(0)]
        public required int CreatedById { get; set; }
    }
}