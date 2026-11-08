using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class P33zzdddn123 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "PercentCashLeft",
                table: "BudgetSurplusBurnRateDto",
                type: "NUMERIC(5,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "RemainingBalance",
                table: "BudgetSurplusBurnRateDto",
                type: "NUMERIC(15,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PercentCashLeft",
                table: "BudgetSurplusBurnRateDto");

            migrationBuilder.DropColumn(
                name: "RemainingBalance",
                table: "BudgetSurplusBurnRateDto");
        }
    }
}
