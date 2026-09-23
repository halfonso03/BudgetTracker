using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain
{
    [Table("tblReport")]
    public class Report
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        public required string Name { get; set; }

        [Column("path")]
        public required string Path { get; set; }

        [Column("category_id")]
        public required byte CategoryId { get; set; }

        [Column("enabled")]
        public required bool Enabled { get; set; }

        [Column("default_download_filename")]
        public required string DefaultFileName { get; set; }
        public List<ReportParameter> Parameters { get; set; } = [];
        public ReportCategory? Category { get; set; }




        // [NotMapped]
        // public bool IsFavorite { get; internal set; }
    }


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


        public Report? Report { get; set; }


        // public required string ControlName { get; set; }

        // [Column("control_type")]
        // public required string ControlType { get; set; }

        // [Column("hidden")]
        // public bool Hidden { get; set; }

        // [Column("depends_on")]
        // [MaxLength(100)]
        // public required string DependsOn { get; set; }

        // [Column("depends_on_action")]
        // [MaxLength(100)]
        // public required string DependsOnAction { get; set; }

        // [Column("is_report_param")]
        // public bool IsReportParam { get; set; }
    }


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
