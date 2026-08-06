using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Comments3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tblComment");

            migrationBuilder.CreateTable(
                name: "tblBudgetComment",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    comment_text = table.Column<string>(type: "varchar(max)", nullable: false),
                    InitiativeId = table.Column<int>(type: "int", nullable: false),
                    GrantId = table.Column<int>(type: "int", nullable: false),
                    AccountId = table.Column<int>(type: "int", nullable: false),
                    entry_date = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETDATE()"),
                    entry_user_id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblBudgetComment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tblBudgetComment_tblAccount_AccountId",
                        column: x => x.AccountId,
                        principalTable: "tblAccount",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tblBudgetComment_tblAuthorizedUsers_entry_user_id",
                        column: x => x.entry_user_id,
                        principalTable: "tblAuthorizedUsers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tblBudgetComment_tblGrant_GrantId",
                        column: x => x.GrantId,
                        principalTable: "tblGrant",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tblBudgetComment_tblInitiative_InitiativeId",
                        column: x => x.InitiativeId,
                        principalTable: "tblInitiative",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_tblBudgetComment_AccountId",
                table: "tblBudgetComment",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_tblBudgetComment_entry_user_id",
                table: "tblBudgetComment",
                column: "entry_user_id");

            migrationBuilder.CreateIndex(
                name: "IX_tblBudgetComment_GrantId",
                table: "tblBudgetComment",
                column: "GrantId");

            migrationBuilder.CreateIndex(
                name: "IX_tblBudgetComment_InitiativeId",
                table: "tblBudgetComment",
                column: "InitiativeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tblBudgetComment");

            migrationBuilder.CreateTable(
                name: "tblComment",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    entry_user_id = table.Column<int>(type: "int", nullable: false),
                    entry_date = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETDATE()"),
                    comment_text = table.Column<string>(type: "varchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblComment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tblComment_tblAuthorizedUsers_entry_user_id",
                        column: x => x.entry_user_id,
                        principalTable: "tblAuthorizedUsers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_tblComment_entry_user_id",
                table: "tblComment",
                column: "entry_user_id");
        }
    }
}
