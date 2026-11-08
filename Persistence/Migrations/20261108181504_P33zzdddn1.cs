using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class P33zzdddn1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CumulativeSpent",
                table: "BudgetSurplusBurnRateDto");

            migrationBuilder.DropColumn(
                name: "CurrentMonthlyBurnRate",
                table: "BudgetSurplusBurnRateDto");

            migrationBuilder.DropColumn(
                name: "MonthsOfRunwayLeft",
                table: "BudgetSurplusBurnRateDto");

            migrationBuilder.DropColumn(
                name: "PercentCashLeft",
                table: "BudgetSurplusBurnRateDto");

            migrationBuilder.DropColumn(
                name: "ProjectedExhaustionDate",
                table: "BudgetSurplusBurnRateDto");

            migrationBuilder.DropColumn(
                name: "RemainingBalance",
                table: "BudgetSurplusBurnRateDto");

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

            migrationBuilder.AlterColumn<decimal>(
                name: "PercentTimeElapsed",
                table: "BudgetSurplusBurnRateDto",
                type: "NUMERIC(5,2)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "TotalAllocation",
                table: "BudgetSurplusBurnRateDto",
                type: "NUMERIC(15,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<int>(
                name: "PercentTimeElapsed",
                table: "BudgetSurplusBurnRateDto",
                type: "int",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "NUMERIC(5,2)");

            migrationBuilder.AddColumn<decimal>(
                name: "CumulativeSpent",
                table: "BudgetSurplusBurnRateDto",
                type: "NUMERIC(15,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "CurrentMonthlyBurnRate",
                table: "BudgetSurplusBurnRateDto",
                type: "NUMERIC(15,4)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<double>(
                name: "MonthsOfRunwayLeft",
                table: "BudgetSurplusBurnRateDto",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "PercentCashLeft",
                table: "BudgetSurplusBurnRateDto",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<DateTime>(
                name: "ProjectedExhaustionDate",
                table: "BudgetSurplusBurnRateDto",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<decimal>(
                name: "RemainingBalance",
                table: "BudgetSurplusBurnRateDto",
                type: "NUMERIC(15,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<double>(
                name: "SurplusGapPoints",
                table: "BudgetSurplusBurnRateDto",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<int>(
                name: "SurplusScore",
                table: "BudgetSurplusBurnRateDto",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
