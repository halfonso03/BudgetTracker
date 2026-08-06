using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    [Table("tblBudgetComment")]
    public class BudgetComment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public required string Text { get; set; }
        public required int InitiativeId { get; set; }
        public required int GrantId { get; set; }
        public required int AccountId { get; set; }
        public required DateTime EntryDate { get; set; }
        public required int EntryPersonId { get; set; }
        public AuthorizedUser? EntryPerson { get; set; }
        public Grant? Grant { get; set; }
        public Initiative? Initiative { get; set; }
        public Account? Account { get; set; }

    }
}