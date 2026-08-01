using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class SeedCategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "tblCategory",
                columns: new[] { "id", "name" },
                values: new object[,]
                {
                    { 1, "Personnel" },
                    { 2, "Fringe" },
                    { 3, "Supplies" },
                    { 4, "Facilities" },
                    { 5, "Equipment" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "tblCategory",
                keyColumn: "id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "tblCategory",
                keyColumn: "id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "tblCategory",
                keyColumn: "id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "tblCategory",
                keyColumn: "id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "tblCategory",
                keyColumn: "id",
                keyValue: 5);
        }
    }
}
