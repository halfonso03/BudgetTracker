using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class ReproSearchParams
    {
        public required int Year { get; set; }
        public List<int>? InitiativeIds { get; set; } = [];
        public List<int>? GrantIds { get; set; } = [];
        public List<int>? AccountIds { get; set; } = [];
        public bool? Posted { get; set; }
    }
}