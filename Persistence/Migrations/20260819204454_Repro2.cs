using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Repro2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tblRepro_tblAuthorizedUsers_posted_by",
                table: "tblRepro");

            migrationBuilder.AlterColumn<int>(
                name: "posted_by",
                table: "tblRepro",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<bool>(
                name: "posted",
                table: "tblRepro",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AddForeignKey(
                name: "FK_tblRepro_tblAuthorizedUsers_posted_by",
                table: "tblRepro",
                column: "posted_by",
                principalTable: "tblAuthorizedUsers",
                principalColumn: "id",
                onDelete: ReferentialAction.NoAction);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tblRepro_tblAuthorizedUsers_posted_by",
                table: "tblRepro");

            migrationBuilder.AlterColumn<int>(
                name: "posted_by",
                table: "tblRepro",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "posted",
                table: "tblRepro",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_tblRepro_tblAuthorizedUsers_posted_by",
                table: "tblRepro",
                column: "posted_by",
                principalTable: "tblAuthorizedUsers",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
