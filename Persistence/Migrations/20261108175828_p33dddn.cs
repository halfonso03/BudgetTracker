using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class p33dddn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BudgetSurplusBurnRateDto",
                columns: table => new
                {
                    InitiativeName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GrantName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BudgetStart = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CurrentMonth = table.Column<int>(type: "int", nullable: false),
                    PercentTimeElapsed = table.Column<int>(type: "int", nullable: false),
                    TotalAllocation = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CumulativeSpent = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    RemainingBalance = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PercentCashLeft = table.Column<double>(type: "float", nullable: false),
                    CurrentMonthlyBurnRate = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MonthsOfRunwayLeft = table.Column<double>(type: "float", nullable: false),
                    ProjectedExhaustionDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SurplusGapPoints = table.Column<double>(type: "float", nullable: false),
                    SurplusScore = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BudgetSurplusBurnRateDto");
        }
    }
}
