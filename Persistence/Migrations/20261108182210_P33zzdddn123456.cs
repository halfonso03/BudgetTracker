using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class P33zzdddn123456 : Migration
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

            migrationBuilder.AddColumn<decimal>(
                name: "SurplusGapPoints",
                table: "BudgetSurplusBurnRateDto",
                type: "NUMERIC(10,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "SurplusScore",
                table: "BudgetSurplusBurnRateDto",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SurplusGapPoints",
                table: "BudgetSurplusBurnRateDto");

            migrationBuilder.DropColumn(
                name: "SurplusScore",
                table: "BudgetSurplusBurnRateDto");

            migrationBuilder.AlterColumn<decimal>(
                name: "TotalAllocation",
                table: "BudgetSurplusBurnRateDto",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "NUMERIC(15,2)");
        }
    }
}
