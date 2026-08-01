using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class SeedBudget : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "tblAuthorizedUsers",
                columns: new[] { "id", "last_login_date", "windows_login" },
                values: new object[] { 1, null, "halfonso" });

            migrationBuilder.InsertData(
                table: "tblBudget",
                columns: new[] { "Id", "account_id", "amount", "create_date", "created_by", "grant_id", "initiative_id", "item_type", "update_date", "updated_by" },
                values: new object[] { 1, 1, 100.0, new DateTime(2026, 7, 31, 8, 0, 0, 0, DateTimeKind.Unspecified), 1, 1, 1, "B", null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "tblAuthorizedUsers",
                keyColumn: "id",
                keyValue: 1);
        }
    }
}
