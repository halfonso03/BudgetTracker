using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class wewe : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "tblBudgetHeader",
                keyColumns: new[] { "grant_id", "initiative_id" },
                keyValues: new object[] { 2, 1 });

            migrationBuilder.InsertData(
                table: "tblBudgetHeader",
                columns: new[] { "grant_id", "initiative_id", "updated_by", "update_date" },
                values: new object[,]
                {
                    { 3, 1, null, null },
                    { 1, 2, null, null },
                    { 3, 2, null, null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "tblBudgetHeader",
                keyColumns: new[] { "grant_id", "initiative_id" },
                keyValues: new object[] { 3, 1 });

            migrationBuilder.DeleteData(
                table: "tblBudgetHeader",
                keyColumns: new[] { "grant_id", "initiative_id" },
                keyValues: new object[] { 1, 2 });

            migrationBuilder.DeleteData(
                table: "tblBudgetHeader",
                keyColumns: new[] { "grant_id", "initiative_id" },
                keyValues: new object[] { 3, 2 });

            migrationBuilder.InsertData(
                table: "tblBudgetHeader",
                columns: new[] { "grant_id", "initiative_id", "updated_by", "update_date" },
                values: new object[] { 2, 1, null, null });
        }
    }
}
