using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Repro9 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tblRepro_tblAuthorizedUsers_UpdatedById",
                table: "tblRepro");

            migrationBuilder.DropForeignKey(
                name: "FK_tblReproLineItem_tblAuthorizedUsers_UpdatedById",
                table: "tblReproLineItem");

            migrationBuilder.RenameColumn(
                name: "UpdatedById",
                table: "tblReproLineItem",
                newName: "updated_by");

            migrationBuilder.RenameIndex(
                name: "IX_tblReproLineItem_UpdatedById",
                table: "tblReproLineItem",
                newName: "IX_tblReproLineItem_updated_by");

            migrationBuilder.RenameColumn(
                name: "UpdatedById",
                table: "tblRepro",
                newName: "updated_by");

            migrationBuilder.RenameIndex(
                name: "IX_tblRepro_UpdatedById",
                table: "tblRepro",
                newName: "IX_tblRepro_updated_by");

            migrationBuilder.AddColumn<DateTime>(
                name: "updated_date",
                table: "tblRepro",
                type: "DATETIME",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_tblRepro_tblAuthorizedUsers_updated_by",
                table: "tblRepro",
                column: "updated_by",
                principalTable: "tblAuthorizedUsers",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_tblReproLineItem_tblAuthorizedUsers_updated_by",
                table: "tblReproLineItem",
                column: "updated_by",
                principalTable: "tblAuthorizedUsers",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tblRepro_tblAuthorizedUsers_updated_by",
                table: "tblRepro");

            migrationBuilder.DropForeignKey(
                name: "FK_tblReproLineItem_tblAuthorizedUsers_updated_by",
                table: "tblReproLineItem");

            migrationBuilder.DropColumn(
                name: "updated_date",
                table: "tblRepro");

            migrationBuilder.RenameColumn(
                name: "updated_by",
                table: "tblReproLineItem",
                newName: "UpdatedById");

            migrationBuilder.RenameIndex(
                name: "IX_tblReproLineItem_updated_by",
                table: "tblReproLineItem",
                newName: "IX_tblReproLineItem_UpdatedById");

            migrationBuilder.RenameColumn(
                name: "updated_by",
                table: "tblRepro",
                newName: "UpdatedById");

            migrationBuilder.RenameIndex(
                name: "IX_tblRepro_updated_by",
                table: "tblRepro",
                newName: "IX_tblRepro_UpdatedById");

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
    }
}
