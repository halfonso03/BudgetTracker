using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    [Table("tblCostCenterType")]
    public class CostCenterType
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("name", TypeName = "VARCHAR(100)")]
        public required string Name { get; set; }
    }
}