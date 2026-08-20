using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs.Repro
{
    public class ReproLineItemDto
    {
        public int RowId { get; set; }

        public int InitiativeId { get; set; }

        public int GrantId { get; set; }

        public int CategoryId { get; set; }

        public int AccountId { get; set; }

        public double Increase { get; set; }

        public double Decrease { get; set; }


    }
}