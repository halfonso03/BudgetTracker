using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ionvoic2e : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_tblDisbLineItem_payee_id",
                table: "tblDisbLineItem");

            migrationBuilder.CreateIndex(
                name: "IX_tblDisbLineItem_payee_id_invoice_number",
                table: "tblDisbLineItem",
                columns: new[] { "payee_id", "invoice_number" },
                unique: true,
                filter: "[invoice_number] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_tblDisbLineItem_payee_id_invoice_number",
                table: "tblDisbLineItem");

            migrationBuilder.CreateIndex(
                name: "IX_tblDisbLineItem_payee_id",
                table: "tblDisbLineItem",
                column: "payee_id");
        }
    }
}
