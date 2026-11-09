using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class p33zzdddn123434 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                schema: "Report",
                table: "tblReport",
                columns: new[] { "id", "category_id", "default_download_filename", "enabled", "name", "path" },
                values: new object[] { 3, (byte)1, "AccountBalances", true, "Account Balances", "/AccountBalances" });

            migrationBuilder.InsertData(
                schema: "Report",
                table: "tblReportParamter",
                columns: new[] { "id", "control_type", "depends_on", "enabled", "label", "name", "report_id", "sort_order" },
                values: new object[] { 6, "dropdownlist", null, true, "Year", "aiYear", 3, (byte)1 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                schema: "Report",
                table: "tblReportParamter",
                keyColumn: "id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                schema: "Report",
                table: "tblReport",
                keyColumn: "id",
                keyValue: 3);
        }
    }
}
