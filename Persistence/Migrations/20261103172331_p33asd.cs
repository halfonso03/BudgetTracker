using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class p33asd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameIndex(
                name: "Unq_tblDisbLineItem_PayeeId_InvoiceNumber",
                table: "tblDisbLineItem",
                newName: "IX_tblDisbLineItem_payee_id_invoice_number");

            migrationBuilder.RenameIndex(
                name: "Unq_tblDisbLineItem_DisbId_PayeeId_PaymentNumber",
                table: "tblDisbLineItem",
                newName: "IX_tblDisbLineItem_disb_id_payee_id_payment_number");

            migrationBuilder.RenameIndex(
                name: "Unq_tblDisbLineItem_DisbId_InitId_GrantId_CatId_AccId_PayeeId",
                table: "tblDisbLineItem",
                newName: "IX_tblDisbLineItem_disb_id_initiative_id_grant_id_category_id_account_id_payee_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameIndex(
                name: "IX_tblDisbLineItem_payee_id_invoice_number",
                table: "tblDisbLineItem",
                newName: "Unq_tblDisbLineItem_PayeeId_InvoiceNumber");

            migrationBuilder.RenameIndex(
                name: "IX_tblDisbLineItem_disb_id_payee_id_payment_number",
                table: "tblDisbLineItem",
                newName: "Unq_tblDisbLineItem_DisbId_PayeeId_PaymentNumber");

            migrationBuilder.RenameIndex(
                name: "IX_tblDisbLineItem_disb_id_initiative_id_grant_id_category_id_account_id_payee_id",
                table: "tblDisbLineItem",
                newName: "Unq_tblDisbLineItem_DisbId_InitId_GrantId_CatId_AccId_PayeeId");
        }
    }
}
