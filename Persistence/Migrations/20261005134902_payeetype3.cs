using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class payeetype3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tblContrator");

            migrationBuilder.AddColumn<string>(
                name: "additional_information",
                table: "tblPayee",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 1,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 2,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 3,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 4,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 5,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 6,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 7,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 8,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 9,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 10,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 11,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 12,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 13,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 14,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 15,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 16,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 17,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 18,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 19,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 20,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 21,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 22,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 23,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 24,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 25,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 26,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 27,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 28,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 29,
                column: "additional_information",
                value: null);

            migrationBuilder.UpdateData(
                table: "tblPayee",
                keyColumn: "id",
                keyValue: 31,
                column: "additional_information",
                value: null);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "additional_information",
                table: "tblPayee");

            migrationBuilder.CreateTable(
                name: "tblContrator",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    account_id = table.Column<int>(type: "int", nullable: false),
                    email = table.Column<string>(type: "VARCHAR(250)", nullable: false),
                    firstName = table.Column<string>(type: "VARCHAR(250)", nullable: false),
                    is_active = table.Column<bool>(type: "bit", nullable: false),
                    lastName = table.Column<string>(type: "VARCHAR(250)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblContrator", x => x.id);
                    table.ForeignKey(
                        name: "FK_tblContrator_tblAccount_account_id",
                        column: x => x.account_id,
                        principalTable: "tblAccount",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_tblContrator_account_id",
                table: "tblContrator",
                column: "account_id");
        }
    }
}
