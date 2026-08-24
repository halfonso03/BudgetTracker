using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    [Table("tblReproLineItem")]
    public class ReproLineItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public required int ReproId { get; set; }
        public required int RowId { get; set; }
        public required int InitiativeId { get; set; }
        public required int GrantId { get; set; }
        public required int CategoryId { get; set; }
        public required int AccountId { get; set; }
        public decimal? Increase { get; set; }
        public decimal? Decrease { get; set; }
        public required int Year { get; set; }
        public required DateTime EntryDate { get; set; }
        public DateTime? UpdateDate { get; set; }
        public int? UpdatedById { get; set; }

        [ForeignKey("UpdatedById")]
        public AuthorizedUser? UpdatedBy { get; set; }

        [ForeignKey("ReproId")]
        public Repro? Repro { get; set; }

        public Initiative? Initiative { get; set; }
        public Grant? Grant { get; set; }
        public Category? Category { get; set; }
        public Account? Account { get; set; }
        public string? Comment { get; set; }
    }
}