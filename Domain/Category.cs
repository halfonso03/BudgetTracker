using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain
{
    [Table("tblCategory")]
    public class Category
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public required string Name { get; set; }
        public IList<Account> Accounts { get; set; } = [];
        public IList<ReproLineItem>? ReproLineItems { get; set; }
        public IList<DisbLineItem>? DisbLineItems { get; set; }
        public required int SortOrder { get; set; }
    }
}