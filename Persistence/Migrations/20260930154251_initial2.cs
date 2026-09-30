using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class initial2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "tblContrator",
                columns: new[] { "id", "account_id", "email", "firstName", "is_active", "lastName" },
                values: new object[,]
                {
                    { 8, 19, "tmartine@nhac.org", "Tafoya", true, "Martina" },
                    { 9, 19, "jcormier@nhac.org", "Jim", true, "Cormier" },
                    { 10, 19, "sdoyne@nhac.org", "Shaun", true, "Doyne" },
                    { 11, 19, "jeadie@nhac.org", "John", true, "Eadie" },
                    { 12, 19, "ohall@nhac.org", "Orman", true, "Hall" },
                    { 13, 19, "dhamby@nhac.org", "David", true, "Hamby" },
                    { 14, 19, "cjakim@nhac.org", "Christopher", true, "Jakim" },
                    { 15, 19, "ekempton@nhac.org", "Emma", true, "Kempton" },
                    { 16, 19, "rroggeveen@nhac.org", "Rob", true, "Roggeveen" },
                    { 17, 19, "ssales@nhac.org", "Steve", true, "Salas" },
                    { 18, 19, "msnyders@nhac.org", "Mike", true, "Snyders" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "tblContrator",
                keyColumn: "id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "tblContrator",
                keyColumn: "id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "tblContrator",
                keyColumn: "id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "tblContrator",
                keyColumn: "id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "tblContrator",
                keyColumn: "id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "tblContrator",
                keyColumn: "id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "tblContrator",
                keyColumn: "id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "tblContrator",
                keyColumn: "id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "tblContrator",
                keyColumn: "id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "tblContrator",
                keyColumn: "id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "tblContrator",
                keyColumn: "id",
                keyValue: 18);
        }
    }
}
