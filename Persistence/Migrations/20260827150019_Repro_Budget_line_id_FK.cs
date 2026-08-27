using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Repro_Budget_line_id_FK : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_tblReproLineItem_budget_line_id",
                table: "tblReproLineItem",
                column: "budget_line_id");

            migrationBuilder.AddForeignKey(
                name: "FK_tblReproLineItem_tblBudget_budget_line_id",
                table: "tblReproLineItem",
                column: "budget_line_id",
                principalTable: "tblBudget",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tblReproLineItem_tblBudget_budget_line_id",
                table: "tblReproLineItem");

            migrationBuilder.DropIndex(
                name: "IX_tblReproLineItem_budget_line_id",
                table: "tblReproLineItem");
        }
    }
}
