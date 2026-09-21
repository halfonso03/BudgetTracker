using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Disb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "tblDisb",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    year = table.Column<int>(type: "int", nullable: false),
                    create_date = table.Column<DateTime>(type: "DATETIME", nullable: false),
                    created_by = table.Column<int>(type: "int", nullable: false),
                    updated_by = table.Column<int>(type: "int", nullable: true),
                    posted = table.Column<bool>(type: "bit", nullable: false),
                    posted_by = table.Column<int>(type: "int", nullable: true),
                    posted_date = table.Column<DateTime>(type: "DATETIME", nullable: true),
                    updated_date = table.Column<DateTime>(type: "DATETIME", nullable: true),
                    amount = table.Column<decimal>(type: "NUMERIC(15,2)", nullable: false),
                    justification = table.Column<string>(type: "VARCHAR(MAX)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblDisb", x => x.id);
                    table.ForeignKey(
                        name: "FK_tblDisb_tblAuthorizedUsers_created_by",
                        column: x => x.created_by,
                        principalTable: "tblAuthorizedUsers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tblDisb_tblAuthorizedUsers_posted_by",
                        column: x => x.posted_by,
                        principalTable: "tblAuthorizedUsers",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_tblDisb_tblAuthorizedUsers_updated_by",
                        column: x => x.updated_by,
                        principalTable: "tblAuthorizedUsers",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "tblDisbLineItem",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    disb_id = table.Column<int>(type: "int", nullable: false),
                    row_id = table.Column<int>(type: "int", nullable: false),
                    initiative_id = table.Column<int>(type: "int", nullable: false),
                    grant_id = table.Column<int>(type: "int", nullable: false),
                    category_id = table.Column<int>(type: "int", nullable: false),
                    account_id = table.Column<int>(type: "int", nullable: false),
                    amount = table.Column<decimal>(type: "NUMERIC(15,2)", nullable: false),
                    year = table.Column<int>(type: "int", nullable: false),
                    entry_date = table.Column<DateTime>(type: "DATETIME", nullable: false),
                    update_date = table.Column<DateTime>(type: "DATETIME", nullable: true),
                    updated_by = table.Column<int>(type: "int", nullable: true),
                    comment = table.Column<string>(type: "VARCHAR(MAX)", nullable: true),
                    budget_line_id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblDisbLineItem", x => x.id);
                    table.ForeignKey(
                        name: "FK_tblDisbLineItem_tblAccount_account_id",
                        column: x => x.account_id,
                        principalTable: "tblAccount",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tblDisbLineItem_tblAuthorizedUsers_updated_by",
                        column: x => x.updated_by,
                        principalTable: "tblAuthorizedUsers",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_tblDisbLineItem_tblBudget_budget_line_id",
                        column: x => x.budget_line_id,
                        principalTable: "tblBudget",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_tblDisbLineItem_tblCategory_category_id",
                        column: x => x.category_id,
                        principalTable: "tblCategory",
                        principalColumn: "id",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_tblDisbLineItem_tblDisb_disb_id",
                        column: x => x.disb_id,
                        principalTable: "tblDisb",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tblDisbLineItem_tblGrant_grant_id",
                        column: x => x.grant_id,
                        principalTable: "tblGrant",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tblDisbLineItem_tblInitiative_initiative_id",
                        column: x => x.initiative_id,
                        principalTable: "tblInitiative",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_tblDisb_created_by",
                table: "tblDisb",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "IX_tblDisb_posted_by",
                table: "tblDisb",
                column: "posted_by");

            migrationBuilder.CreateIndex(
                name: "IX_tblDisb_updated_by",
                table: "tblDisb",
                column: "updated_by");

            migrationBuilder.CreateIndex(
                name: "IX_tblDisbLineItem_account_id",
                table: "tblDisbLineItem",
                column: "account_id");

            migrationBuilder.CreateIndex(
                name: "IX_tblDisbLineItem_budget_line_id",
                table: "tblDisbLineItem",
                column: "budget_line_id");

            migrationBuilder.CreateIndex(
                name: "IX_tblDisbLineItem_category_id",
                table: "tblDisbLineItem",
                column: "category_id");

            migrationBuilder.CreateIndex(
                name: "IX_tblDisbLineItem_disb_id_initiative_id_grant_id_category_id_account_id",
                table: "tblDisbLineItem",
                columns: new[] { "disb_id", "initiative_id", "grant_id", "category_id", "account_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_tblDisbLineItem_grant_id",
                table: "tblDisbLineItem",
                column: "grant_id");

            migrationBuilder.CreateIndex(
                name: "IX_tblDisbLineItem_initiative_id",
                table: "tblDisbLineItem",
                column: "initiative_id");

            migrationBuilder.CreateIndex(
                name: "IX_tblDisbLineItem_updated_by",
                table: "tblDisbLineItem",
                column: "updated_by");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tblDisbLineItem");

            migrationBuilder.DropTable(
                name: "tblDisb");
        }
    }
}
