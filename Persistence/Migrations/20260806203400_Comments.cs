using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Comments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "tblAuthorizedUsers",
                keyColumn: "id",
                keyValue: 1,
                column: "windows_login",
                value: "hialfonso");

            migrationBuilder.InsertData(
                table: "tblAuthorizedUsers",
                columns: new[] { "id", "last_login_date", "windows_login" },
                values: new object[,]
                {
                    { 2, null, "rxleopold" },
                    { 3, null, "rescobar" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "tblAuthorizedUsers",
                keyColumn: "id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "tblAuthorizedUsers",
                keyColumn: "id",
                keyValue: 3);

            migrationBuilder.UpdateData(
                table: "tblAuthorizedUsers",
                keyColumn: "id",
                keyValue: 1,
                column: "windows_login",
                value: "halfonso");
        }
    }
}
