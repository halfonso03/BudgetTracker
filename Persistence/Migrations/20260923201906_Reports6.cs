using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Reports6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "depends_on",
                table: "tblReportParamter",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "tblReportParamter",
                keyColumn: "id",
                keyValue: 1,
                column: "depends_on",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblReportParamter",
                keyColumn: "id",
                keyValue: 2,
                column: "depends_on",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblReportParamter",
                keyColumn: "id",
                keyValue: 3,
                column: "depends_on",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblReportParamter",
                keyColumn: "id",
                keyValue: 4,
                column: "depends_on",
                value: "aiYear");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "depends_on",
                table: "tblReportParamter");
        }
    }
}
