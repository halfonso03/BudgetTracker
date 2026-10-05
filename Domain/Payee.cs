using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{

    public enum PayeeType : int
    {
        Vendor = 1,
        Contractor = 2,
    }

    [Table("tblPayee")]
    public class Payee
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public int AccountId { get; set; }
        public Account? Account { get; set; }
        public bool IsActive { get; set; }
        public string? AdditionalInformation { get; set; }
        public required PayeeType PayeeTypeId { get; set; }
        public IList<DisbLineItem>? DisbLineItems { get; set; }

    }
}