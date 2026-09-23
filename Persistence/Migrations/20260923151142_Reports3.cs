using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Reports3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "tblReport",
                keyColumn: "id",
                keyValue: 1,
                column: "name",
                value: "Grant Balance By Initiative and AR");

            migrationBuilder.InsertData(
                table: "tblReport",
                columns: new[] { "id", "category_id", "default_download_filename", "enabled", "name", "path" },
                values: new object[] { 2, (byte)1, "BudgetDetail", true, "Budget Detail", "/BudgetDetail" });

            migrationBuilder.InsertData(
                table: "tblReportParamter",
                columns: new[] { "id", "label", "name", "report_id", "sort_order" },
                values: new object[,]
                {
                    { 3, "Year", "aiYear", 2, (byte)1 },
                    { 4, "Grant", "avcGrants", 2, (byte)2 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "tblReportParamter",
                keyColumn: "id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "tblReportParamter",
                keyColumn: "id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "tblReport",
                keyColumn: "id",
                keyValue: 2);

            migrationBuilder.UpdateData(
                table: "tblReport",
                keyColumn: "id",
                keyValue: 1,
                column: "name",
                value: "2c. Grant Balance By Initiative and AR");
        }
    }
}
