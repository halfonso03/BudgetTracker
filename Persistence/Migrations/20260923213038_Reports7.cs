using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Reports7 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "enabled",
                table: "tblReportParamter",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "tblReportParamter",
                keyColumn: "id",
                keyValue: 1,
                column: "enabled",
                value: true);

            migrationBuilder.UpdateData(
                table: "tblReportParamter",
                keyColumn: "id",
                keyValue: 2,
                column: "enabled",
                value: true);

            migrationBuilder.UpdateData(
                table: "tblReportParamter",
                keyColumn: "id",
                keyValue: 3,
                column: "enabled",
                value: true);

            migrationBuilder.UpdateData(
                table: "tblReportParamter",
                keyColumn: "id",
                keyValue: 4,
                column: "enabled",
                value: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "enabled",
                table: "tblReportParamter");
        }
    }
}
