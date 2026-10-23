using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ddddddd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "LastLoginInDate",
                schema: "Auth",
                table: "tblUsers",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.UpdateData(
                schema: "Auth",
                table: "tblUsers",
                keyColumn: "Id",
                keyValue: 1,
                column: "LastLoginInDate",
                value: null);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastLoginInDate",
                schema: "Auth",
                table: "tblUsers");
        }
    }
}
