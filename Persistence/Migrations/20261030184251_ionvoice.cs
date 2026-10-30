using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ionvoice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "check_number",
                table: "tblDisbLineItem",
                type: "VARCHAR(100)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "invoice_date",
                table: "tblDisbLineItem",
                type: "DATETIME2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "invoice_number",
                table: "tblDisbLineItem",
                type: "VARCHAR(100)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "check_number",
                table: "tblDisbLineItem");

            migrationBuilder.DropColumn(
                name: "invoice_date",
                table: "tblDisbLineItem");

            migrationBuilder.DropColumn(
                name: "invoice_number",
                table: "tblDisbLineItem");
        }
    }
}
