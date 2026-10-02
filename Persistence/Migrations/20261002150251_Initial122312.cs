using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Initial122312 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "additional_information",
                table: "tblBudget",
                type: "VARCHAR(1000)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 1,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 2,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 3,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 5,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 6,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 7,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 9,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 10,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 11,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 12,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblBudget",
                keyColumn: "Id",
                keyValue: 13,
                column: "additional_information",
                value: null);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "additional_information",
                table: "tblBudget");
        }
    }
}
