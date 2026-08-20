using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs.Repro
{
    public class BalancesResponseDto
    {
        public required Key1 Key { get; set; }
        public required List<Balance1> Balances { get; set; }

        public class Key1
        {
            public required int InitiativeId { get; set; }
            public required int GrantId { get; set; }
            public required int CategoryId { get; set; }

        }

        public class Balance1
        {
            public required int AccountId { get; set; }
            public required decimal CurrentAmount { get; set; }
            public required string Name { get; set; }
        }
    }
}