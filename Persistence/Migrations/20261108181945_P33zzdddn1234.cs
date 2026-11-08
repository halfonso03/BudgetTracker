using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class P33zzdddn1234 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "CurrentMonthlyBurnRate",
                table: "BudgetSurplusBurnRateDto",
                type: "NUMERIC(5,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "MonthsOfRunwayLeft",
                table: "BudgetSurplusBurnRateDto",
                type: "NUMERIC(10,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CurrentMonthlyBurnRate",
                table: "BudgetSurplusBurnRateDto");

            migrationBuilder.DropColumn(
                name: "MonthsOfRunwayLeft",
                table: "BudgetSurplusBurnRateDto");
        }
    }
}
