using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    [Table("tblCostCenter")]
    public class CostCenter
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        public int CostCenterTypeId { get; set; }
        public CostCenterType? CostCenterType { get; set; }
    }
}