using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Application.Validators;
using Microsoft.Identity.Client;

namespace Application.DTOs.Disb
{
    public class UpdateDisbRequestDto : DisbRequestBaseDto
    {
        [Required]
        public required int Id { get; set; }

        public required int UpdatedById { get; set; }
    }
}