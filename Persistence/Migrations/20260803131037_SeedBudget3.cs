using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class SeedBudget3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "tblBudget",
                columns: new[] { "Id", "account_id", "amount", "create_date", "created_by", "grant_id", "initiative_id", "item_type", "update_date", "updated_by" },
                values: new object[,]
                {
                    { 4, 4, 105.0, new DateTime(2026, 7, 31, 8, 0, 0, 0, DateTimeKind.Unspecified), 1, 1, 1, "B", null, null },
                    { 5, 7, 1200.0, new DateTime(2026, 7, 31, 8, 0, 0, 0, DateTimeKind.Unspecified), 1, 1, 1, "B", null, null },
                    { 6, 8, 400.0, new DateTime(2026, 7, 31, 8, 0, 0, 0, DateTimeKind.Unspecified), 1, 1, 1, "B", null, null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 6);
        }
    }
}
