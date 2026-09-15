using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class seeddate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "tblInitiative",
                columns: new[] { "id", "name" },
                values: new object[,]
                {
                    { 6, "Management & Coordination 2" },
                    { 7, "Training 2" },
                    { 8, "ORS 2" },
                    { 9, "Multimedia & Technology Unit 2" },
                    { 10, "DHE 3" },
                    { 11, "Management & Coordination 3" },
                    { 12, "Training 3" },
                    { 13, "ORS 3" },
                    { 14, "Multimedia & Technology Unit 3" },
                    { 15, "DHE 4" },
                    { 16, "Management & Coordination 4" },
                    { 17, "Training 4" },
                    { 18, "ORS 4" },
                    { 19, "Multimedia & Technology Unit 4" },
                    { 20, "DHE 4" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "tblInitiative",
                keyColumn: "id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "tblInitiative",
                keyColumn: "id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "tblInitiative",
                keyColumn: "id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "tblInitiative",
                keyColumn: "id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "tblInitiative",
                keyColumn: "id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "tblInitiative",
                keyColumn: "id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "tblInitiative",
                keyColumn: "id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "tblInitiative",
                keyColumn: "id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "tblInitiative",
                keyColumn: "id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "tblInitiative",
                keyColumn: "id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "tblInitiative",
                keyColumn: "id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "tblInitiative",
                keyColumn: "id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "tblInitiative",
                keyColumn: "id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "tblInitiative",
                keyColumn: "id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "tblInitiative",
                keyColumn: "id",
                keyValue: 20);
        }
    }
}
