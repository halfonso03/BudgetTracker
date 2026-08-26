using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Azure.Core;

namespace Application.DTOs.Repro
{
    public class ReproResponseDto
    {
        public required int Id { get; set; } = 0;
        public required DateTime CreateDate { get; set; }
        public required string CreatedBy { get; set; }
        public required int CreatedById { get; set; }
        public int? UpdatedById { get; set; }
        public DateTime? UpdateDate { get; set; }
        public string? PostedBy { get; set; }
        public DateTime? PostedDate { get; set; }
        public required bool Posted { get; set; }
        public int? PostedById { get; set; }
        public string? Justification { get; set; }
        public List<ReproLineItemResponseDto> LineItems { get; set; } = [];
        public required List<BalancesResponseDto> RowBalances { get; set; }
        public int Year { get; internal set; }

        // type RowBalance = {
        //     key: { initiativeId: number; grantId: number; categoryId: number };
        //     balances: { accountId: number; name: string; currentAmount: number }[];
        // };

    }
}