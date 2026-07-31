using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class BudgetLineItem
    {
        public required double Amount { get; set; }
        public required string ItemType { get; set; }
        public int InitiativeId { get; set; }
        public int GrantId { get; set; }
        public int AccountId { get; set; }
        public required Initiative Initiative { get; set; }
        public required Grant Grant { get; set; }
        public required Account Account { get; set; }
        public required DateTime CreateDate { get; set; }
        public int CreatedBy { get; set; }

        [ForeignKey(nameof(CreatedBy))]
        public required AuthorizedUser CreatedByUser { get; set; }

        [ForeignKey(nameof(CreatedBy))]
        public required AuthorizedUser UpdatedByUser { get; set; }
        public DateTime? UpdateDate { get; set; }
        public int? UpdatedBy { get; set; }

    }
}