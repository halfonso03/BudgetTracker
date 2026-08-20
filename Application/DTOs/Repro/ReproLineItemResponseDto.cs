using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Identity.Client;

namespace Application.DTOs.Repro
{
    public class ReproLineItemResponseDto
    {
        public required int RowId { get; set; }

        public required int InitiativeId { get; set; }
        public required string InitiativeName { get; set; }

        public required int GrantId { get; set; }
        public required string GrantName { get; set; }

        public required int CategoryId { get; set; }
        public required string CategoryName { get; set; }

        public required int AccountId { get; set; }
        public required string AccountName { get; set; }

        public required decimal Increase { get; set; }

        public required decimal Decrease { get; set; }

    }
}