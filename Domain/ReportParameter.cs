using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    [Table("tblReportParamter")]
    public class ReportParameter
    {

        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("sort_order")]
        public required byte SortOrder { get; set; }

        [Column("name")]
        public required string Name { get; set; }

        [Column("label")]
        public required string Label { get; set; }

        [Column("report_id")]
        public required int ReportId { get; set; }

        [Column("depends_on")]
        public string? DependsOn { get; set; }

        [Column("enabled")]
        public required bool Enabled { get; set; }

        public Report? Report { get; set; }

        public override bool Equals(object? obj)
        {
            if (obj is ReportParameter param)
            {
                return param.ReportId == ReportId && param.Name == Name;
            }

            return false;
        }

        public override int GetHashCode()
        {
            return base.GetHashCode();
        }

        // public required string ControlName { get; set; }

        [Column("control_type")]
        public required string ControlType { get; set; }

        // [Column("hidden")]
        // public bool Hidden { get; set; }

  
        // [Column("depends_on_action")]
        // [MaxLength(100)]
        // public required string DependsOnAction { get; set; }

        // [Column("is_report_param")]
        // public bool IsReportParam { get; set; }
    }
}