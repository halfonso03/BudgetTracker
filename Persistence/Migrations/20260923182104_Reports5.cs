using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Reports5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "control_type",
                table: "tblReportParamter",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "tblReportParamter",
                keyColumn: "id",
                keyValue: 1,
                column: "control_type",
                value: "dropdownlist");

            migrationBuilder.UpdateData(
                table: "tblReportParamter",
                keyColumn: "id",
                keyValue: 2,
                column: "control_type",
                value: "checkboxlist");

            migrationBuilder.UpdateData(
                table: "tblReportParamter",
                keyColumn: "id",
                keyValue: 3,
                column: "control_type",
                value: "dropdownlist");

            migrationBuilder.UpdateData(
                table: "tblReportParamter",
                keyColumn: "id",
                keyValue: 4,
                column: "control_type",
                value: "checkboxlist");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "control_type",
                table: "tblReportParamter");
        }
    }
}
