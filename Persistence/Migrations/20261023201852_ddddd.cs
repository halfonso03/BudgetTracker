using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ddddd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ForcePasswordChangeOnNextLogin",
                schema: "Auth",
                table: "tblUsers",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                schema: "Auth",
                table: "tblUsers",
                keyColumn: "Id",
                keyValue: 1,
                column: "ForcePasswordChangeOnNextLogin",
                value: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ForcePasswordChangeOnNextLogin",
                schema: "Auth",
                table: "tblUsers");
        }
    }
}
