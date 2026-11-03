using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class p33ddn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_tblDisbLineItem_disb_id_payee_id_payment_number",
                table: "tblDisbLineItem",
                columns: new[] { "disb_id", "payee_id", "payment_number" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_tblDisbLineItem_disb_id_payee_id_payment_number",
                table: "tblDisbLineItem");
        }
    }
}
