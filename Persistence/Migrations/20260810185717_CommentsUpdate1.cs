using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class CommentsUpdate1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "update_date",
                table: "tblBudgetComment",
                type: "datetime",
                nullable: true,
                defaultValueSql: "GETDATE()");

            migrationBuilder.AddColumn<int>(
                name: "update_user_id",
                table: "tblBudgetComment",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_tblBudgetComment_update_user_id",
                table: "tblBudgetComment",
                column: "update_user_id");

            migrationBuilder.AddForeignKey(
                name: "FK_tblBudgetComment_tblAuthorizedUsers_update_user_id",
                table: "tblBudgetComment",
                column: "update_user_id",
                principalTable: "tblAuthorizedUsers",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tblBudgetComment_tblAuthorizedUsers_update_user_id",
                table: "tblBudgetComment");

            migrationBuilder.DropIndex(
                name: "IX_tblBudgetComment_update_user_id",
                table: "tblBudgetComment");

            migrationBuilder.DropColumn(
                name: "update_date",
                table: "tblBudgetComment");

            migrationBuilder.DropColumn(
                name: "update_user_id",
                table: "tblBudgetComment");
        }
    }
}
