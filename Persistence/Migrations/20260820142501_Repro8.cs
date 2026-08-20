using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Repro8 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UpdatedById",
                table: "tblReproLineItem",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedById",
                table: "tblRepro",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_tblReproLineItem_UpdatedById",
                table: "tblReproLineItem",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_tblRepro_UpdatedById",
                table: "tblRepro",
                column: "UpdatedById");

            migrationBuilder.AddForeignKey(
                name: "FK_tblRepro_tblAuthorizedUsers_UpdatedById",
                table: "tblRepro",
                column: "UpdatedById",
                principalTable: "tblAuthorizedUsers",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_tblReproLineItem_tblAuthorizedUsers_UpdatedById",
                table: "tblReproLineItem",
                column: "UpdatedById",
                principalTable: "tblAuthorizedUsers",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tblRepro_tblAuthorizedUsers_UpdatedById",
                table: "tblRepro");

            migrationBuilder.DropForeignKey(
                name: "FK_tblReproLineItem_tblAuthorizedUsers_UpdatedById",
                table: "tblReproLineItem");

            migrationBuilder.DropIndex(
                name: "IX_tblReproLineItem_UpdatedById",
                table: "tblReproLineItem");

            migrationBuilder.DropIndex(
                name: "IX_tblRepro_UpdatedById",
                table: "tblRepro");

            migrationBuilder.DropColumn(
                name: "UpdatedById",
                table: "tblReproLineItem");

            migrationBuilder.DropColumn(
                name: "UpdatedById",
                table: "tblRepro");
        }
    }
}
