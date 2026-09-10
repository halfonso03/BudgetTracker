using System;
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
                table: "tblBudget",
                columns: new[] { "Id", "account_id", "amount", "create_date", "created_by", "grant_id", "initiative_id", "item_type", "update_date", "updated_by" },
                values: new object[,]
                {
                    { 1, 1, 100m,"7/31/2026", 1, 1, 1, "B", null, null },
                    { 2, 3, 100m,"7/31/2026", 1, 1, 1, "B", null, null },
                    { 3, 4, 105m,"7/31/2026", 1, 1, 1, "B", null, null },
                    { 5, 7, 1200m,"7/31/2026", 1, 1, 1, "B", null, null },
                    { 6, 8, 400m,"7/31/2026", 1, 1, 1, "B", null, null },
                    { 7, 5, 596.0m,"7/31/2026", 1, 1, 1, "B", null, null },
                    { 9, 8, 400m,"7/31/2026", 1, 1, 2, "B", null, null },
                    { 10, 5, 750m,"7/31/2026", 1, 3, 1, "B", null, null },
                    { 11, 8, 250m,"7/31/2026", 1, 3, 2, "B", null, null },
                    { 12, 8, 250m,"7/31/2026", 1, 3, 2, "B", null, null },
                    { 13, 5, 100m,"7/31/2026", 1, 3, 2, "D", null, null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 13);
        }
    }
}
