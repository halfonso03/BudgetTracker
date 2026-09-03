using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class ReproSearchParams
    {
        public required int Year { get; set; }        
        public List<int>? InitiativeIds { get; set; } = [];
        public List<int>? GrantIds { get; set; } = [];
        public List<int>? AccountIds { get; set; } = [];
        public ReproSearchStatus Status { get; set; }
        public AmountComparer DebitComparer { get; set; }
        public AmountComparer CreditComparer { get; set; }
        public decimal DebitAmount { get; set; }
        public decimal CreditAmount { get; set; }
    }


    public enum ReproSearchStatus
    {
        ALL,
        SAVED,
        POSTED
    }

    public enum AmountComparer
    {
        GreaterThan,
        LessThan,
        EqualTo
    }


}