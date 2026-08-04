using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class updateinitiaives : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "tblInitiative",
                keyColumn: "id",
                keyValue: 3,
                column: "name",
                value: "Overdose Response Strategy");

            migrationBuilder.InsertData(
                table: "tblInitiative",
                columns: new[] { "id", "name" },
                values: new object[,]
                {
                    { 4, "Multimedia & Technology Unit" },
                    { 5, "Domestic Highway Enforcement" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "tblInitiative",
                keyColumn: "id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "tblInitiative",
                keyColumn: "id",
                keyValue: 5);

            migrationBuilder.UpdateData(
                table: "tblInitiative",
                keyColumn: "id",
                keyValue: 3,
                column: "name",
                value: "Multemedia & Technology");
        }
    }
}
