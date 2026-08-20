using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Repro13 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "amount",
                table: "tblBudget",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "float");

            migrationBuilder.UpdateData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 1,
                column: "amount",
                value: 100m);

            migrationBuilder.UpdateData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 2,
                column: "amount",
                value: 100m);

            migrationBuilder.UpdateData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 3,
                column: "amount",
                value: 105m);

            migrationBuilder.UpdateData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 5,
                column: "amount",
                value: 1200m);

            migrationBuilder.UpdateData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 6,
                column: "amount",
                value: 400m);

            migrationBuilder.UpdateData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 7,
                column: "amount",
                value: 596.0m);

            migrationBuilder.UpdateData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 9,
                column: "amount",
                value: 400m);

            migrationBuilder.UpdateData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 10,
                column: "amount",
                value: 750m);

            migrationBuilder.UpdateData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 11,
                column: "amount",
                value: 250m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<double>(
                name: "amount",
                table: "tblBudget",
                type: "float",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.UpdateData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 1,
                column: "amount",
                value: 100.0);

            migrationBuilder.UpdateData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 2,
                column: "amount",
                value: 100.0);

            migrationBuilder.UpdateData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 3,
                column: "amount",
                value: 105.0);

            migrationBuilder.UpdateData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 5,
                column: "amount",
                value: 1200.0);

            migrationBuilder.UpdateData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 6,
                column: "amount",
                value: 400.0);

            migrationBuilder.UpdateData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 7,
                column: "amount",
                value: 596.00999999999999);

            migrationBuilder.UpdateData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 9,
                column: "amount",
                value: 400.0);

            migrationBuilder.UpdateData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 10,
                column: "amount",
                value: 750.0);

            migrationBuilder.UpdateData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 11,
                column: "amount",
                value: 250.0);
        }
    }
}
