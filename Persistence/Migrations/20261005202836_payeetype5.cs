using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class payeetype5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "tblGrant",
                keyColumn: "id",
                keyValue: 1,
                column: "fiduciary",
                value: "COMS");

            migrationBuilder.UpdateData(
                table: "tblInitiative",
                keyColumn: "id",
                keyValue: 3,
                column: "name",
                value: "SOR");

            migrationBuilder.UpdateData(
                table: "tblInitiative",
                keyColumn: "id",
                keyValue: 5,
                column: "name",
                value: "HED");

            migrationBuilder.UpdateData(
                table: "tblInitiative",
                keyColumn: "id",
                keyValue: 6,
                column: "name",
                value: "TAG");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "tblGrant",
                keyColumn: "id",
                keyValue: 1,
                column: "fiduciary",
                value: "MSCO");

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

            migrationBuilder.UpdateData(
                table: "tblInitiative",
                keyColumn: "id",
                keyValue: 6,
                column: "name",
                value: "DTAG");
        }
    }
}
