using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    [Table("tblVendor")]
    public class Payee
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public int AccountId { get; set; }
        public Account? Account { get; set; }
        public bool IsActive { get; set; }
        public IList<DisbLineItem>? DisbLineItems { get; set; }

    }
}