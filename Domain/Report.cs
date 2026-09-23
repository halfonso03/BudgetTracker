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
}
