using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Repro_unqieindex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_tblReproLineItem_initiative_id",
                table: "tblReproLineItem");

            migrationBuilder.CreateIndex(
                name: "IX_tblReproLineItem_initiative_id_grant_id_category_id_account_id",
                table: "tblReproLineItem",
                columns: new[] { "initiative_id", "grant_id", "category_id", "account_id" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_tblReproLineItem_initiative_id_grant_id_category_id_account_id",
                table: "tblReproLineItem");

            migrationBuilder.CreateIndex(
                name: "IX_tblReproLineItem_initiative_id",
                table: "tblReproLineItem",
                column: "initiative_id");
        }
    }
}
