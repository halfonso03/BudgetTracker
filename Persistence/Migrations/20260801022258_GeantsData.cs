using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class GeantsData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Fiduciary",
                table: "tblGrant",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.InsertData(
                table: "tblGrant",
                columns: new[] { "id", "end_date", "Fiduciary", "name", "start_date" },
                values: new object[,]
                {
                    { 1, new DateTime(2028, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "MSCO", "G26001", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2, new DateTime(2028, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Cameron Co", "G26001", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "tblGrant",
                keyColumn: "id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "tblGrant",
                keyColumn: "id",
                keyValue: 2);

            migrationBuilder.DropColumn(
                name: "Fiduciary",
                table: "tblGrant");
        }
    }
}
