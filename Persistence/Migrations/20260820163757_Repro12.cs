using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Repro12 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_tblReproLineItem_account_id",
                table: "tblReproLineItem",
                column: "account_id");

            migrationBuilder.CreateIndex(
                name: "IX_tblReproLineItem_category_id",
                table: "tblReproLineItem",
                column: "category_id");

            migrationBuilder.CreateIndex(
                name: "IX_tblReproLineItem_grant_id",
                table: "tblReproLineItem",
                column: "grant_id");

            migrationBuilder.CreateIndex(
                name: "IX_tblReproLineItem_initiative_id",
                table: "tblReproLineItem",
                column: "initiative_id");

            migrationBuilder.AddForeignKey(
                name: "FK_tblReproLineItem_tblAccount_account_id",
                table: "tblReproLineItem",
                column: "account_id",
                principalTable: "tblAccount",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_tblReproLineItem_tblCategory_category_id",
                table: "tblReproLineItem",
                column: "category_id",
                principalTable: "tblCategory",
                principalColumn: "id",
                onDelete: ReferentialAction.NoAction);

            migrationBuilder.AddForeignKey(
                name: "FK_tblReproLineItem_tblGrant_grant_id",
                table: "tblReproLineItem",
                column: "grant_id",
                principalTable: "tblGrant",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_tblReproLineItem_tblInitiative_initiative_id",
                table: "tblReproLineItem",
                column: "initiative_id",
                principalTable: "tblInitiative",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tblReproLineItem_tblAccount_account_id",
                table: "tblReproLineItem");

            migrationBuilder.DropForeignKey(
                name: "FK_tblReproLineItem_tblCategory_category_id",
                table: "tblReproLineItem");

            migrationBuilder.DropForeignKey(
                name: "FK_tblReproLineItem_tblGrant_grant_id",
                table: "tblReproLineItem");

            migrationBuilder.DropForeignKey(
                name: "FK_tblReproLineItem_tblInitiative_initiative_id",
                table: "tblReproLineItem");

            migrationBuilder.DropIndex(
                name: "IX_tblReproLineItem_account_id",
                table: "tblReproLineItem");

            migrationBuilder.DropIndex(
                name: "IX_tblReproLineItem_category_id",
                table: "tblReproLineItem");

            migrationBuilder.DropIndex(
                name: "IX_tblReproLineItem_grant_id",
                table: "tblReproLineItem");

            migrationBuilder.DropIndex(
                name: "IX_tblReproLineItem_initiative_id",
                table: "tblReproLineItem");
        }
    }
}
