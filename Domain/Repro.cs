using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    [Table("tblRepro")]
    public class Repro
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public required DateTime CreatedDate { get; set; }
        public required int CreatedById { get; set; }
        public required bool Posted { get; set; }
        public int? PostedById { get; set; }
        public DateTime? PostedDate { get; set; }
        public required double Amount { get; set; }
        public required string Justification { get; set; }
        public required IList<ReproLineItem> Items { get; set; }

        [ForeignKey("CreatedById")]
        public AuthorizedUser? CreatedBy { get; set; }

        [ForeignKey("PostedById")]
        public AuthorizedUser? PostedBy { get; set; }
    }
}