using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Initial1212 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_tblDisbLineItem_disb_id_initiative_id_grant_id_category_id_account_id",
                table: "tblDisbLineItem");

            migrationBuilder.CreateIndex(
                name: "IX_tblDisbLineItem_disb_id_initiative_id_grant_id_category_id_account_id_payee_id",
                table: "tblDisbLineItem",
                columns: new[] { "disb_id", "initiative_id", "grant_id", "category_id", "account_id", "payee_id" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_tblDisbLineItem_disb_id_initiative_id_grant_id_category_id_account_id_payee_id",
                table: "tblDisbLineItem");

            migrationBuilder.CreateIndex(
                name: "IX_tblDisbLineItem_disb_id_initiative_id_grant_id_category_id_account_id",
                table: "tblDisbLineItem",
                columns: new[] { "disb_id", "initiative_id", "grant_id", "category_id", "account_id" },
                unique: true);
        }
    }
}
