using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class initial2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tblBudget_tblBudgetItemType2_item_type",
                table: "tblBudget");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tblBudgetItemType2",
                table: "tblBudgetItemType2");

            migrationBuilder.RenameTable(
                name: "tblBudgetItemType2",
                newName: "tblBudgetItemType");

            migrationBuilder.AddPrimaryKey(
                name: "PK_tblBudgetItemType",
                table: "tblBudgetItemType",
                column: "item_type");

            migrationBuilder.AddForeignKey(
                name: "FK_tblBudget_tblBudgetItemType_item_type",
                table: "tblBudget",
                column: "item_type",
                principalTable: "tblBudgetItemType",
                principalColumn: "item_type",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tblBudget_tblBudgetItemType_item_type",
                table: "tblBudget");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tblBudgetItemType",
                table: "tblBudgetItemType");

            migrationBuilder.RenameTable(
                name: "tblBudgetItemType",
                newName: "tblBudgetItemType2");

            migrationBuilder.AddPrimaryKey(
                name: "PK_tblBudgetItemType2",
                table: "tblBudgetItemType2",
                column: "item_type");

            migrationBuilder.AddForeignKey(
                name: "FK_tblBudget_tblBudgetItemType2_item_type",
                table: "tblBudget",
                column: "item_type",
                principalTable: "tblBudgetItemType2",
                principalColumn: "item_type",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
