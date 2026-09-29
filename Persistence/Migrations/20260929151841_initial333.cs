using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class initial333 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 1,
                columns: new[] { "name", "number" },
                values: new object[] { "Salaries", "1" });

            migrationBuilder.UpdateData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 2,
                columns: new[] { "category_id", "name", "number" },
                values: new object[] { 2, "Janitorial", "1" });

            migrationBuilder.UpdateData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 3,
                columns: new[] { "category_id", "name", "number" },
                values: new object[] { 2, "Rentals and Leases", "1" });

            migrationBuilder.UpdateData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 4,
                columns: new[] { "category_id", "name", "number" },
                values: new object[] { 2, "Utilities Services - Electric", "1" });

            migrationBuilder.UpdateData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 5,
                columns: new[] { "category_id", "name", "number" },
                values: new object[] { 3, "FICA", "1" });

            migrationBuilder.UpdateData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 6,
                columns: new[] { "category_id", "name", "number" },
                values: new object[] { 3, "Life & Health Insurance", "1" });

            migrationBuilder.UpdateData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 7,
                columns: new[] { "name", "number" },
                values: new object[] { "Insurance Fringe", "1" });

            migrationBuilder.UpdateData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 8,
                columns: new[] { "name", "number" },
                values: new object[] { "Retirement", "1" });

            migrationBuilder.UpdateData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 9,
                columns: new[] { "name", "number" },
                values: new object[] { "Workers Comp", "1" });

            migrationBuilder.InsertData(
                table: "tblAccount",
                columns: new[] { "id", "category_id", "name", "number" },
                values: new object[,]
                {
                    { 10, 4, "Equipment - Over $5,000", "1" },
                    { 11, 5, "Cardwell, Tim", "1" },
                    { 12, 5, "Cormier, Jim", "1" },
                    { 13, 5, "Doyne, Shaun", "1" },
                    { 14, 5, "Eadie, John", "1" },
                    { 15, 5, "Hall, Orman", "1" },
                    { 16, 5, "Hamby, David", "1" },
                    { 17, 5, "Jakim, Christopher", "1" },
                    { 18, 5, "Kempton, Emma", "1" },
                    { 19, 5, "Quigley, Dale", "1" },
                    { 20, 5, "Roggeveen, Rob", "1" },
                    { 21, 5, "Salas, Steve", "1" },
                    { 22, 5, "Snyders, Mike", "1" },
                    { 23, 5, "Tafoya, Martina", "1" }
                });

            migrationBuilder.UpdateData(
                table: "tblCategory",
                keyColumn: "id",
                keyValue: 1,
                column: "name",
                value: "Personnel");

            migrationBuilder.UpdateData(
                table: "tblCategory",
                keyColumn: "id",
                keyValue: 3,
                column: "name",
                value: "Fringe");

            migrationBuilder.UpdateData(
                table: "tblCategory",
                keyColumn: "id",
                keyValue: 4,
                column: "name",
                value: "Equipment");

            migrationBuilder.UpdateData(
                table: "tblCategory",
                keyColumn: "id",
                keyValue: 5,
                column: "name",
                value: "Services Contractors");

            migrationBuilder.InsertData(
                table: "tblCategory",
                columns: new[] { "id", "name" },
                values: new object[,]
                {
                    { 6, "Services Vendors" },
                    { 7, "Supplies" },
                    { 8, "Travel Contractor" },
                    { 9, "Travel Agency" }
                });

            migrationBuilder.InsertData(
                table: "tblAccount",
                columns: new[] { "id", "category_id", "name", "number" },
                values: new object[,]
                {
                    { 24, 6, "Insurance Other", "1" },
                    { 25, 6, "Freight and Postage Services", "1" },
                    { 26, 6, "Communication Services", "1" },
                    { 27, 6, "Other Contractual Services", "1" },
                    { 28, 7, "Office", "1" },
                    { 29, 7, "Software", "1" },
                    { 30, 7, "Machinery and Equipment  ($1,000 to $5,000)", "1" },
                    { 31, 8, "Travel Contractor", "1" },
                    { 32, 9, "Travel Agency", "1" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 26);

            migrationBuilder.DeleteData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 27);

            migrationBuilder.DeleteData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 28);

            migrationBuilder.DeleteData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 29);

            migrationBuilder.DeleteData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 30);

            migrationBuilder.DeleteData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 31);

            migrationBuilder.DeleteData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 32);

            migrationBuilder.DeleteData(
                table: "tblCategory",
                keyColumn: "id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "tblCategory",
                keyColumn: "id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "tblCategory",
                keyColumn: "id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "tblCategory",
                keyColumn: "id",
                keyValue: 9);

            migrationBuilder.UpdateData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 1,
                columns: new[] { "name", "number" },
                values: new object[] { "Printing & Binding", "11-102-0312-54700" });

            migrationBuilder.UpdateData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 2,
                columns: new[] { "category_id", "name", "number" },
                values: new object[] { 1, "Insurance-Other", "11-102-0312-54701" });

            migrationBuilder.UpdateData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 3,
                columns: new[] { "category_id", "name", "number" },
                values: new object[] { 1, "Freight & Postage Service", "11-102-0312-54702" });

            migrationBuilder.UpdateData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 4,
                columns: new[] { "category_id", "name", "number" },
                values: new object[] { 1, "Communication Services", "11-102-0312-54703" });

            migrationBuilder.UpdateData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 5,
                columns: new[] { "category_id", "name", "number" },
                values: new object[] { 2, "Rentals & Lease", "11-102-0312-54704" });

            migrationBuilder.UpdateData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 6,
                columns: new[] { "category_id", "name", "number" },
                values: new object[] { 2, "Utilities - Electric", "11-102-0312-54705" });

            migrationBuilder.UpdateData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 7,
                columns: new[] { "name", "number" },
                values: new object[] { "Toner", "11-102-0312-54706" });

            migrationBuilder.UpdateData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 8,
                columns: new[] { "name", "number" },
                values: new object[] { "Pens", "11-102-0312-54707" });

            migrationBuilder.UpdateData(
                table: "tblAccount",
                keyColumn: "id",
                keyValue: 9,
                columns: new[] { "name", "number" },
                values: new object[] { "Erasers", "11-102-0312-54708" });

            migrationBuilder.UpdateData(
                table: "tblCategory",
                keyColumn: "id",
                keyValue: 1,
                column: "name",
                value: "Services");

            migrationBuilder.UpdateData(
                table: "tblCategory",
                keyColumn: "id",
                keyValue: 3,
                column: "name",
                value: "Supplies");

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
        }
    }
}
