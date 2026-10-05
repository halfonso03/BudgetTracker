using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class payeetype : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PayeeTypeId",
                table: "tblPayee",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 1,
                column: "PayeeTypeId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 2,
                column: "PayeeTypeId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 3,
                column: "PayeeTypeId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 4,
                column: "PayeeTypeId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 5,
                column: "PayeeTypeId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 6,
                column: "PayeeTypeId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 7,
                column: "PayeeTypeId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 8,
                column: "PayeeTypeId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 9,
                column: "PayeeTypeId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 10,
                column: "PayeeTypeId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 11,
                column: "PayeeTypeId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 12,
                column: "PayeeTypeId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 13,
                column: "PayeeTypeId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 14,
                column: "PayeeTypeId",
                value: 2);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 15,
                column: "PayeeTypeId",
                value: 2);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 16,
                column: "PayeeTypeId",
                value: 2);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 17,
                column: "PayeeTypeId",
                value: 2);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 18,
                column: "PayeeTypeId",
                value: 2);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 19,
                column: "PayeeTypeId",
                value: 2);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 20,
                column: "PayeeTypeId",
                value: 2);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 21,
                column: "PayeeTypeId",
                value: 2);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 22,
                column: "PayeeTypeId",
                value: 2);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 23,
                column: "PayeeTypeId",
                value: 2);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 24,
                column: "PayeeTypeId",
                value: 2);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 25,
                column: "PayeeTypeId",
                value: 2);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 26,
                column: "PayeeTypeId",
                value: 2);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 27,
                column: "PayeeTypeId",
                value: 2);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 28,
                column: "PayeeTypeId",
                value: 2);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 29,
                column: "PayeeTypeId",
                value: 2);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 31,
                column: "PayeeTypeId",
                value: 2);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PayeeTypeId",
                table: "tblPayee");
        }
    }
}
