using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Runtime.Intrinsics.X86;
using System.Threading.Tasks;

namespace Domain
{
    [Table("tblAuthorizedUsers")]
    public class AuthorizedUser
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public required string WindowsLogin { get; set; }

        public DateTime? LastLoginDate { get; set; }
    }
}