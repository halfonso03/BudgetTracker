using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Application.Validators;
using Microsoft.Identity.Client;

namespace Application.DTOs.Repro
{
    public class UpdateReproRequestDto : ReproRequestBaseDto
    {
        [Required]
        public required int Id { get; set; }

        [JsonPropertyName("updated_by_id")]
        public required int UpdatedById { get; set; }
    }
}