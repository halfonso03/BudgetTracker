using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class initial1234 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "allow_neg_balance",
                table: "tblReproLineItem",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "sort_order",
                table: "tblCategory",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "tblCategory",
                keyColumn: "id",
                keyValue: 1,
                column: "sort_order",
                value: 1);

            migrationBuilder.UpdateData(
                table: "tblCategory",
                keyColumn: "id",
                keyValue: 2,
                column: "sort_order",
                value: 2);

            migrationBuilder.UpdateData(
                table: "tblCategory",
                keyColumn: "id",
                keyValue: 3,
                column: "sort_order",
                value: 3);

            migrationBuilder.UpdateData(
                table: "tblCategory",
                keyColumn: "id",
                keyValue: 4,
                column: "sort_order",
                value: 4);

            migrationBuilder.UpdateData(
                table: "tblCategory",
                keyColumn: "id",
                keyValue: 5,
                column: "sort_order",
                value: 5);

            migrationBuilder.UpdateData(
                table: "tblCategory",
                keyColumn: "id",
                keyValue: 6,
                column: "sort_order",
                value: 6);

            migrationBuilder.UpdateData(
                table: "tblCategory",
                keyColumn: "id",
                keyValue: 7,
                column: "sort_order",
                value: 7);

            migrationBuilder.UpdateData(
                table: "tblCategory",
                keyColumn: "id",
                keyValue: 8,
                column: "sort_order",
                value: 8);

            migrationBuilder.UpdateData(
                table: "tblCategory",
                keyColumn: "id",
                keyValue: 9,
                column: "sort_order",
                value: 9);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "allow_neg_balance",
                table: "tblReproLineItem");

            migrationBuilder.DropColumn(
                name: "sort_order",
                table: "tblCategory");
        }
    }
}
