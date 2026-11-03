using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Application.DTOs.Payment
{
    public class PaymentSearchParams
    {
        public required int Year { get; set; }
        public List<int>? InitiativeIds { get; set; } = [];
        public List<int>? XInitiativeIds { get; set; } = [];
        public List<int>? GrantIds { get; set; } = [];
        public List<int>? XGrantIds { get; set; } = [];
        public List<int>? AccountIds { get; set; } = [];
        public List<int>? XAccountIds { get; set; } = [];
        public PaymentSearchStatus Status { get; set; }
    
    }


    public enum PaymentSearchStatus
    {
        ALL,
        SAVED,
        POSTED
    }

    // public enum AmountComparer
    // {
    //     None,
    //     GreaterThan,
    //     LessThan,
    //     EqualTo
    // }


}