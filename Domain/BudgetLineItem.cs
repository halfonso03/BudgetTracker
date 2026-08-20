using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Domain
{
    [Table("tblBudget")]
    public class BudgetLineItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column(Order = 0)]
        public required int Id { get; set; } = 0;
        [Column(Order = 4)]
        public required decimal Amount { get; set; }
        [Column(Order = 5)]
        public required string ItemType { get; set; }

        [Column(Order = 1)]
        public int InitiativeId { get; set; }

        [Column(Order = 2)]
        public int GrantId { get; set; }

        [Column(Order = 3)]
        public int AccountId { get; set; }
        public Initiative? Initiative { get; set; }
        public Grant? Grant { get; set; }
        public Account? Account { get; set; }

        [Column(Order = 7)]
        public required DateTime CreateDate { get; set; }

        [Column(Order = 6)]
        public int CreatedBy { get; set; }

        [ForeignKey(nameof(CreatedBy))]
        public AuthorizedUser? CreatedByUser { get; set; }

        [Column(Order = 9)]
        public DateTime? UpdateDate { get; set; }

        [Column(Order = 8)]
        public int? UpdatedBy { get; set; }

        [ForeignKey(nameof(UpdatedBy))]
        public AuthorizedUser? UpdatedByUser { get; set; }

    }
}