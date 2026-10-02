using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Initial2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tblDisb_tblGrant_GrantId",
                table: "tblDisb");

            migrationBuilder.DropIndex(
                name: "IX_tblDisb_GrantId",
                table: "tblDisb");

            migrationBuilder.DropColumn(
                name: "GrantId",
                table: "tblDisb");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "GrantId",
                table: "tblDisb",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_tblDisb_GrantId",
                table: "tblDisb",
                column: "GrantId");

            migrationBuilder.AddForeignKey(
                name: "FK_tblDisb_tblGrant_GrantId",
                table: "tblDisb",
                column: "GrantId",
                principalTable: "tblGrant",
                principalColumn: "id");
        }
    }
}
