using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class _1p33zzdddn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "BudgetStart",
                table: "BudgetSurplusBurnRateDto",
                newName: "AwardStartDate");

            migrationBuilder.AddColumn<DateTime>(
                name: "AwardEndDate",
                table: "BudgetSurplusBurnRateDto",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AwardEndDate",
                table: "BudgetSurplusBurnRateDto");

            migrationBuilder.RenameColumn(
                name: "AwardStartDate",
                table: "BudgetSurplusBurnRateDto",
                newName: "BudgetStart");
        }
    }
}
