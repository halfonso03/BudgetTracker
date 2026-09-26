using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain
{
    [Table("tblBudgetItemType")]
    public class BudgetItemType
    {
        [Key]
        public required string ItemType { get; set; }

        public IList<BudgetLineItem>? BudgetLineItems { get; set; }

    }
}