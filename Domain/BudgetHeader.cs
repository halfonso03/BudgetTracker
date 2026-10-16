using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    [Table("tblBudgetHeader")]
    public class BudgetHeader
    {
        public required int InitiativeId { get; set; }
        public required int GrantId { get; set; }
        public DateTime? UpdatedDate { get; set; }

        [ForeignKey("UpdatedByUser")]
        public int UpdatedBy { get; set; }
        public ApplicationUser? UpdatedByUser { get; set; }
        public required Initiative Initiative { get; set; }
        public required Grant Grant { get; set; }
    }
}
