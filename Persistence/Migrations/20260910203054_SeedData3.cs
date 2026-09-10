using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class SeedData3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 14,
                column: "item_type",
                value: "D");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 14,
                column: "item_type",
                value: "B");
        }
    }
}
