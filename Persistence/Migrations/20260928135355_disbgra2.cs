using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class disbgra2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "grant_id",
                table: "tblDisb",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_tblDisb_grant_id",
                table: "tblDisb",
                column: "grant_id");

            migrationBuilder.AddForeignKey(
                name: "FK_tblDisb_tblGrant_grant_id",
                table: "tblDisb",
                column: "grant_id",
                principalTable: "tblGrant",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tblDisb_tblGrant_grant_id",
                table: "tblDisb");

            migrationBuilder.DropIndex(
                name: "IX_tblDisb_grant_id",
                table: "tblDisb");

            migrationBuilder.DropColumn(
                name: "grant_id",
                table: "tblDisb");
        }
    }
}
