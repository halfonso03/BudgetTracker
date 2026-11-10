using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class _1p33zzdddn233 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BudgetSurplusBurnRateDto");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BudgetSurplusBurnRateDto",
                columns: table => new
                {
                    AwardEndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AwardStartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CumulativeSpent = table.Column<decimal>(type: "NUMERIC(15,2)", nullable: false),
                    CurrentMonth = table.Column<int>(type: "int", nullable: false),
                    CurrentMonthlyBurnRate = table.Column<decimal>(type: "NUMERIC(5,2)", nullable: false),
                    GrantName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    InitiativeName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MonthsOfRunwayLeft = table.Column<decimal>(type: "NUMERIC(10,2)", nullable: false),
                    PercentCashLeft = table.Column<decimal>(type: "NUMERIC(5,2)", nullable: false),
                    PercentTimeElapsed = table.Column<decimal>(type: "NUMERIC(5,2)", nullable: false),
                    ProjectedExhaustionDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RemainingBalance = table.Column<decimal>(type: "NUMERIC(15,2)", nullable: false),
                    SurplusGapPoints = table.Column<decimal>(type: "NUMERIC(10,2)", nullable: false),
                    SurplusScore = table.Column<int>(type: "int", nullable: false),
                    TotalAllocation = table.Column<decimal>(type: "NUMERIC(15,2)", nullable: false)
                },
                constraints: table =>
                {
                });
        }
    }
}
