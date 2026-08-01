using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class SeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "tblAccount",
                columns: new[] { "id", "category_id", "name", "number" },
                values: new object[,]
                {
                    { 1, 1, "Printing & Binding", "11-102-0312-54700" },
                    { 2, 1, "Insurance-Other", "11-102-0312-54701" },
                    { 3, 1, "Freight & Postage Service", "11-102-0312-54702" },
                    { 4, 1, "Communication Services", "11-102-0312-54703" },
                    { 5, 2, "Rentals & Lease", "11-102-0312-54704" },
                    { 6, 2, "Utilities - Electric", "11-102-0312-54705" },
                    { 7, 3, "Toner", "11-102-0312-54706" },
                    { 8, 3, "Pens", "11-102-0312-54707" },
                    { 9, 3, "Erasers", "11-102-0312-54708" }
                });

            migrationBuilder.UpdateData(
                table: "tblCategory",
                keyColumn: "id",
                keyValue: 1,
                column: "name",
                value: "Services");

            migrationBuilder.UpdateData(
                table: "tblCategory",
                keyColumn: "id",
                keyValue: 2,
                column: "name",
                value: "Facilities");

            migrationBuilder.UpdateData(
                table: "tblCategory",
                keyColumn: "id",
                keyValue: 4,
                column: "name",
                value: "Personnel");

            migrationBuilder.UpdateData(
                table: "tblCategory",
                keyColumn: "id",
                keyValue: 5,
                column: "name",
                value: "Fringe");

            migrationBuilder.InsertData(
                table: "tblInitiative",
                columns: new[] { "id", "name" },
                values: new object[,]
                {
                    { 1, "Management & Coordination" },
                    { 2, "Training" },
                    { 3, "Multemedia & Technology" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "tblInitiative",
                keyColumn: "id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "tblInitiative",
                keyColumn: "id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "tblInitiative",
                keyColumn: "id",
                keyValue: 3);

            migrationBuilder.UpdateData(
                table: "tblCategory",
                keyColumn: "id",
                keyValue: 1,
                column: "name",
                value: "Personnel");

            migrationBuilder.UpdateData(
                table: "tblCategory",
                keyColumn: "id",
                keyValue: 2,
                column: "name",
                value: "Fringe");

            migrationBuilder.UpdateData(
                table: "tblCategory",
                keyColumn: "id",
                keyValue: 4,
                column: "name",
                value: "Facilities");

            migrationBuilder.UpdateData(
                table: "tblCategory",
                keyColumn: "id",
                keyValue: 5,
                column: "name",
                value: "Equipment");
        }
    }
}
