using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Comments4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tblBudgetComment_tblAccount_AccountId",
                table: "tblBudgetComment");

            migrationBuilder.DropForeignKey(
                name: "FK_tblBudgetComment_tblGrant_GrantId",
                table: "tblBudgetComment");

            migrationBuilder.DropForeignKey(
                name: "FK_tblBudgetComment_tblInitiative_InitiativeId",
                table: "tblBudgetComment");

            migrationBuilder.RenameColumn(
                name: "InitiativeId",
                table: "tblBudgetComment",
                newName: "initiative_id");

            migrationBuilder.RenameColumn(
                name: "GrantId",
                table: "tblBudgetComment",
                newName: "grant_id");

            migrationBuilder.RenameColumn(
                name: "AccountId",
                table: "tblBudgetComment",
                newName: "account_id");

            migrationBuilder.RenameIndex(
                name: "IX_tblBudgetComment_InitiativeId",
                table: "tblBudgetComment",
                newName: "IX_tblBudgetComment_initiative_id");

            migrationBuilder.RenameIndex(
                name: "IX_tblBudgetComment_GrantId",
                table: "tblBudgetComment",
                newName: "IX_tblBudgetComment_grant_id");

            migrationBuilder.RenameIndex(
                name: "IX_tblBudgetComment_AccountId",
                table: "tblBudgetComment",
                newName: "IX_tblBudgetComment_account_id");

            migrationBuilder.AddForeignKey(
                name: "FK_tblBudgetComment_tblAccount_account_id",
                table: "tblBudgetComment",
                column: "account_id",
                principalTable: "tblAccount",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_tblBudgetComment_tblGrant_grant_id",
                table: "tblBudgetComment",
                column: "grant_id",
                principalTable: "tblGrant",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_tblBudgetComment_tblInitiative_initiative_id",
                table: "tblBudgetComment",
                column: "initiative_id",
                principalTable: "tblInitiative",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tblBudgetComment_tblAccount_account_id",
                table: "tblBudgetComment");

            migrationBuilder.DropForeignKey(
                name: "FK_tblBudgetComment_tblGrant_grant_id",
                table: "tblBudgetComment");

            migrationBuilder.DropForeignKey(
                name: "FK_tblBudgetComment_tblInitiative_initiative_id",
                table: "tblBudgetComment");

            migrationBuilder.RenameColumn(
                name: "initiative_id",
                table: "tblBudgetComment",
                newName: "InitiativeId");

            migrationBuilder.RenameColumn(
                name: "grant_id",
                table: "tblBudgetComment",
                newName: "GrantId");

            migrationBuilder.RenameColumn(
                name: "account_id",
                table: "tblBudgetComment",
                newName: "AccountId");

            migrationBuilder.RenameIndex(
                name: "IX_tblBudgetComment_initiative_id",
                table: "tblBudgetComment",
                newName: "IX_tblBudgetComment_InitiativeId");

            migrationBuilder.RenameIndex(
                name: "IX_tblBudgetComment_grant_id",
                table: "tblBudgetComment",
                newName: "IX_tblBudgetComment_GrantId");

            migrationBuilder.RenameIndex(
                name: "IX_tblBudgetComment_account_id",
                table: "tblBudgetComment",
                newName: "IX_tblBudgetComment_AccountId");

            migrationBuilder.AddForeignKey(
                name: "FK_tblBudgetComment_tblAccount_AccountId",
                table: "tblBudgetComment",
                column: "AccountId",
                principalTable: "tblAccount",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_tblBudgetComment_tblGrant_GrantId",
                table: "tblBudgetComment",
                column: "GrantId",
                principalTable: "tblGrant",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_tblBudgetComment_tblInitiative_InitiativeId",
                table: "tblBudgetComment",
                column: "InitiativeId",
                principalTable: "tblInitiative",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
