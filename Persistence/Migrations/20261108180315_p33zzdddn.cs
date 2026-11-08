using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class p33zzdddn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "TotalAllocation",
                table: "BudgetSurplusBurnRateDto",
                type: "NUMERIC(15,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "RemainingBalance",
                table: "BudgetSurplusBurnRateDto",
                type: "NUMERIC(15,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "CurrentMonthlyBurnRate",
                table: "BudgetSurplusBurnRateDto",
                type: "NUMERIC(15,4)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "CumulativeSpent",
                table: "BudgetSurplusBurnRateDto",
                type: "NUMERIC(15,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "TotalAllocation",
                table: "BudgetSurplusBurnRateDto",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "NUMERIC(15,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "RemainingBalance",
                table: "BudgetSurplusBurnRateDto",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "NUMERIC(15,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "CurrentMonthlyBurnRate",
                table: "BudgetSurplusBurnRateDto",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "NUMERIC(15,4)");

            migrationBuilder.AlterColumn<decimal>(
                name: "CumulativeSpent",
                table: "BudgetSurplusBurnRateDto",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "NUMERIC(15,2)");
        }
    }
}
