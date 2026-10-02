using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Initialsdsd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 30);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 19,
                column: "name",
                value: "Steve Salas");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 19,
                column: "name",
                value: "Steve Sales");

            migrationBuilder.InsertData(
                table: "tblPayee",
                columns: new[] { "id", "account_id", "is_active", "name" },
                values: new object[] { 30, 19, true, "Steve Salas" });
        }
    }
}
