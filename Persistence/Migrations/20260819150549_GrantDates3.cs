using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class GrantDates3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "tblGrant",
                keyColumn: "id",
                keyValue: 3,
                column: "fiduciary",
                value: "MCSO");

            migrationBuilder.UpdateData(
                table: "tblInitiative",
                keyColumn: "id",
                keyValue: 3,
                column: "name",
                value: "ORS");

            migrationBuilder.UpdateData(
                table: "tblInitiative",
                keyColumn: "id",
                keyValue: 5,
                column: "name",
                value: "DHE");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "tblGrant",
                keyColumn: "id",
                keyValue: 3,
                column: "fiduciary",
                value: "MCSPo");

            migrationBuilder.UpdateData(
                table: "tblInitiative",
                keyColumn: "id",
                keyValue: 3,
                column: "name",
                value: "Overdose Response Strategy");

            migrationBuilder.UpdateData(
                table: "tblInitiative",
                keyColumn: "id",
                keyValue: 5,
                column: "name",
                value: "Domestic Highway Enforcement");
        }
    }
}
