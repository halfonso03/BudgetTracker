using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    [Table("tblReportCategory")]
    public partial class ReportCategory
    {
        [Key]
        [Column("id")]
        public required byte Id { get; set; }

        [Column("name")]
        public required string Name { get; set; }

        [Column("sort_order")]
        public required byte SortOrder { get; set; }

        public List<Report> Reports { get; set; } = [];
    }
}