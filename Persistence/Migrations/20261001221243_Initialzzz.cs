using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Initialzzz : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "tblCategory",
                keyColumn: "id",
                keyValue: 6,
                column: "name",
                value: "Services Contractors");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "tblCategory",
                keyColumn: "id",
                keyValue: 6,
                column: "name",
                value: "Services Payees");
        }
    }
}
