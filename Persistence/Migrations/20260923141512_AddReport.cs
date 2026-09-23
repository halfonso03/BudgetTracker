using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddReport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "tblReportParamter",
                keyColumn: "id",
                keyValue: 1,
                columns: new[] { "label", "name" },
                values: new object[] { "Year", "aiYear" });

            migrationBuilder.InsertData(
                table: "tblReportParamter",
                columns: new[] { "id", "label", "name", "report_id", "sort_order" },
                values: new object[] { 2, "Initiative", "avcInitiatives", 1, (byte)2 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "tblReportParamter",
                keyColumn: "id",
                keyValue: 2);

            migrationBuilder.UpdateData(
                table: "tblReportParamter",
                keyColumn: "id",
                keyValue: 1,
                columns: new[] { "label", "name" },
                values: new object[] { "Initiative", "avcInitiatives" });
        }
    }
}
