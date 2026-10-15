using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain
{
    [Table("tblBudget", Schema = "Audit")]
    public class BudgetLineItemAudit
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column(Order = 0)]
        public required int Id { get; set; } = 0;

        [Column(Order = 1)]
        public int InitiativeId { get; set; }

        [Column(Order = 2)]
        public int GrantId { get; set; }

        [Column(Order = 3)]
        public int AccountId { get; set; }

        [Column(Order = 4)]
        public required decimal Amount { get; set; }

        [Column(Order = 5)]
        [ForeignKey("BudgetItemType")]
        public required string ItemType { get; set; }

        [Column(Order = 6)]
        public required int Year { get; set; }
        public Initiative? Initiative { get; set; }
        public Grant? Grant { get; set; }
        public Account? Account { get; set; }

        [Column(Order = 8)]
        public required DateTime CreateDate { get; set; }

        [Column(Order = 7)]
        public int CreatedBy { get; set; }

        [ForeignKey(nameof(CreatedBy))]
        public AuthorizedUser? CreatedByUser { get; set; }
        public BudgetItemType? BudgetItemType { get; set; }
        public string? AdditionalInformation { get; set; }
        public required string Version { get; set; }

    }
}