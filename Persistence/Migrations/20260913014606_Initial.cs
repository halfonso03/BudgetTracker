using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "tblAuthorizedUsers",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    windows_login = table.Column<string>(type: "VARCHAR(50)", nullable: false),
                    last_login_date = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblAuthorizedUsers", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "tblCategory",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "VARCHAR(50)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblCategory", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "tblGrant",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "VARCHAR(50)", nullable: false),
                    start_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    end_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    fiduciary = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblGrant", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "tblInitiative",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "VARCHAR(200)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblInitiative", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "tblRepro",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
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
                    table.PrimaryKey("PK_tblRepro", x => x.id);
                    table.ForeignKey(
                        name: "FK_tblRepro_tblAuthorizedUsers_created_by",
                        column: x => x.created_by,
                        principalTable: "tblAuthorizedUsers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tblRepro_tblAuthorizedUsers_posted_by",
                        column: x => x.posted_by,
                        principalTable: "tblAuthorizedUsers",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_tblRepro_tblAuthorizedUsers_updated_by",
                        column: x => x.updated_by,
                        principalTable: "tblAuthorizedUsers",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "tblAccount",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "VARCHAR(500)", nullable: false),
                    number = table.Column<string>(type: "VARCHAR(50)", nullable: false),
                    category_id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblAccount", x => x.id);
                    table.ForeignKey(
                        name: "FK_tblAccount_tblCategory_category_id",
                        column: x => x.category_id,
                        principalTable: "tblCategory",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tblBudget",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    initiative_id = table.Column<int>(type: "int", nullable: false),
                    grant_id = table.Column<int>(type: "int", nullable: false),
                    account_id = table.Column<int>(type: "int", nullable: false),
                    amount = table.Column<decimal>(type: "NUMERIC(15,2)", nullable: false),
                    item_type = table.Column<string>(type: "CHAR(1)", nullable: false),
                    created_by = table.Column<int>(type: "int", nullable: false),
                    create_date = table.Column<DateTime>(type: "DATETIME", nullable: false),
                    updated_by = table.Column<int>(type: "int", nullable: true),
                    update_date = table.Column<DateTime>(type: "DATETIME", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblBudget", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tblBudget_tblAccount_account_id",
                        column: x => x.account_id,
                        principalTable: "tblAccount",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tblBudget_tblAuthorizedUsers_created_by",
                        column: x => x.created_by,
                        principalTable: "tblAuthorizedUsers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tblBudget_tblAuthorizedUsers_updated_by",
                        column: x => x.updated_by,
                        principalTable: "tblAuthorizedUsers",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_tblBudget_tblGrant_grant_id",
                        column: x => x.grant_id,
                        principalTable: "tblGrant",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tblBudget_tblInitiative_initiative_id",
                        column: x => x.initiative_id,
                        principalTable: "tblInitiative",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tblBudgetComment",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    comment_text = table.Column<string>(type: "VARCHAR(MAX)", nullable: false),
                    initiative_id = table.Column<int>(type: "int", nullable: false),
                    grant_id = table.Column<int>(type: "int", nullable: false),
                    account_id = table.Column<int>(type: "int", nullable: false),
                    entry_date = table.Column<DateTime>(type: "DATETIME", nullable: false, defaultValueSql: "GETDATE()"),
                    entry_user_id = table.Column<int>(type: "int", nullable: false),
                    update_date = table.Column<DateTime>(type: "DATETIME", nullable: true, defaultValueSql: "GETDATE()"),
                    update_user_id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblBudgetComment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tblBudgetComment_tblAccount_account_id",
                        column: x => x.account_id,
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
                        name: "FK_tblBudgetComment_tblAuthorizedUsers_update_user_id",
                        column: x => x.update_user_id,
                        principalTable: "tblAuthorizedUsers",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_tblBudgetComment_tblGrant_grant_id",
                        column: x => x.grant_id,
                        principalTable: "tblGrant",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tblBudgetComment_tblInitiative_initiative_id",
                        column: x => x.initiative_id,
                        principalTable: "tblInitiative",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tblReproLineItem",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    repro_id = table.Column<int>(type: "int", nullable: false),
                    row_id = table.Column<int>(type: "int", nullable: false),
                    initiative_id = table.Column<int>(type: "int", nullable: false),
                    grant_id = table.Column<int>(type: "int", nullable: false),
                    category_id = table.Column<int>(type: "int", nullable: false),
                    account_id = table.Column<int>(type: "int", nullable: false),
                    increase = table.Column<decimal>(type: "NUMERIC(15,2)", nullable: true),
                    decrease = table.Column<decimal>(type: "NUMERIC(15,2)", nullable: true),
                    year = table.Column<int>(type: "int", nullable: false),
                    entry_date = table.Column<DateTime>(type: "DATETIME", nullable: false),
                    update_date = table.Column<DateTime>(type: "DATETIME", nullable: true),
                    updated_by = table.Column<int>(type: "int", nullable: true),
                    comment = table.Column<string>(type: "VARCHAR(MAX)", nullable: true),
                    budget_line_id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblReproLineItem", x => x.id);
                    table.ForeignKey(
                        name: "FK_tblReproLineItem_tblAccount_account_id",
                        column: x => x.account_id,
                        principalTable: "tblAccount",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tblReproLineItem_tblAuthorizedUsers_updated_by",
                        column: x => x.updated_by,
                        principalTable: "tblAuthorizedUsers",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_tblReproLineItem_tblBudget_budget_line_id",
                        column: x => x.budget_line_id,
                        principalTable: "tblBudget",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_tblReproLineItem_tblCategory_category_id",
                        column: x => x.category_id,
                        principalTable: "tblCategory",
                        principalColumn: "id",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_tblReproLineItem_tblGrant_grant_id",
                        column: x => x.grant_id,
                        principalTable: "tblGrant",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tblReproLineItem_tblInitiative_initiative_id",
                        column: x => x.initiative_id,
                        principalTable: "tblInitiative",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tblReproLineItem_tblRepro_repro_id",
                        column: x => x.repro_id,
                        principalTable: "tblRepro",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "tblAuthorizedUsers",
                columns: new[] { "id", "last_login_date", "windows_login" },
                values: new object[,]
                {
                    { 1, null, "hialfonso" },
                    { 2, null, "rxleopold" },
                    { 3, null, "rescobar" }
                });

            migrationBuilder.InsertData(
                table: "tblCategory",
                columns: new[] { "id", "name" },
                values: new object[,]
                {
                    { 1, "Services" },
                    { 2, "Facilities" },
                    { 3, "Supplies" },
                    { 4, "Personnel" },
                    { 5, "Fringe" }
                });

            migrationBuilder.InsertData(
                table: "tblGrant",
                columns: new[] { "id", "end_date", "fiduciary", "name", "start_date" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 12, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), "MSCO", "G25001", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2, new DateTime(2026, 12, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), "Cameron Co", "G25002", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 3, new DateTime(2027, 12, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), "MCSO", "G26001", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 4, new DateTime(2027, 12, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), "Cameron Co", "G26002", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) }
                });

            migrationBuilder.InsertData(
                table: "tblInitiative",
                columns: new[] { "id", "name" },
                values: new object[,]
                {
                    { 1, "Management & Coordination" },
                    { 2, "Training" },
                    { 3, "ORS" },
                    { 4, "Multimedia & Technology Unit" },
                    { 5, "DHE" }
                });

            migrationBuilder.InsertData(
                table: "tblAccount",
                columns: new[] { "id", "category_id", "name", "number" },
                values: new object[,]
                {
                    { 1, 1, "Printing & Binding", "11-102-0312-54700" },
                    { 2, 1, "Insurance-Other", "11-102-0312-54701" },
                    { 3, 1, "Freight & Postage Service", "11-102-0312-54702" },
                    { 4, 1, "Communication Services", "11-102-0312-54703" },
                    { 5, 2, "Rentals & Lease", "11-102-0312-54704" },
                    { 6, 2, "Utilities - Electric", "11-102-0312-54705" },
                    { 7, 3, "Toner", "11-102-0312-54706" },
                    { 8, 3, "Pens", "11-102-0312-54707" },
                    { 9, 3, "Erasers", "11-102-0312-54708" }
                });

            migrationBuilder.InsertData(
                table: "tblBudget",
                columns: new[] { "Id", "account_id", "amount", "create_date", "created_by", "grant_id", "initiative_id", "item_type", "update_date", "updated_by" },
                values: new object[,]
                {
                    { 1, 1, 100m, "7/31/2026", 1, 1, 1, "B", null, null },
                    { 2, 3, 100m, "7/31/2026", 1, 1, 1, "B", null, null },
                    { 3, 4, 105m, "7/31/2026", 1, 1, 1, "B", null, null },
                    { 5, 7, 1200m, "7/31/2026", 1, 1, 1, "B", null, null },
                    { 6, 8, 400m, "7/31/2026", 1, 1, 1, "B", null, null },
                    { 7, 5, 596.0m, "7/31/2026", 1, 1, 1, "B", null, null },
                    { 9, 8, 400m, "7/31/2026", 1, 1, 2, "B", null, null },
                    { 10, 5, 750m, "7/31/2026", 1, 3, 1, "B", null, null },
                    { 11, 8, 250m, "7/31/2026", 1, 3, 2, "B", null, null },
                    { 12, 8, 250m, "7/31/2026", 1, 3, 2, "B", null, null },
                    { 13, 1, -50m, "7/31/2026", 1, 1, 1, "D", null, null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_tblAccount_category_id",
                table: "tblAccount",
                column: "category_id");

            migrationBuilder.CreateIndex(
                name: "IX_tblBudget_account_id",
                table: "tblBudget",
                column: "account_id");

            migrationBuilder.CreateIndex(
                name: "IX_tblBudget_created_by",
                table: "tblBudget",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "IX_tblBudget_grant_id",
                table: "tblBudget",
                column: "grant_id");

            migrationBuilder.CreateIndex(
                name: "IX_tblBudget_initiative_id",
                table: "tblBudget",
                column: "initiative_id");

            migrationBuilder.CreateIndex(
                name: "IX_tblBudget_updated_by",
                table: "tblBudget",
                column: "updated_by");

            migrationBuilder.CreateIndex(
                name: "IX_tblBudgetComment_account_id",
                table: "tblBudgetComment",
                column: "account_id");

            migrationBuilder.CreateIndex(
                name: "IX_tblBudgetComment_entry_user_id",
                table: "tblBudgetComment",
                column: "entry_user_id");

            migrationBuilder.CreateIndex(
                name: "IX_tblBudgetComment_grant_id",
                table: "tblBudgetComment",
                column: "grant_id");

            migrationBuilder.CreateIndex(
                name: "IX_tblBudgetComment_initiative_id",
                table: "tblBudgetComment",
                column: "initiative_id");

            migrationBuilder.CreateIndex(
                name: "IX_tblBudgetComment_update_user_id",
                table: "tblBudgetComment",
                column: "update_user_id");

            migrationBuilder.CreateIndex(
                name: "IX_tblRepro_created_by",
                table: "tblRepro",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "IX_tblRepro_posted_by",
                table: "tblRepro",
                column: "posted_by");

            migrationBuilder.CreateIndex(
                name: "IX_tblRepro_updated_by",
                table: "tblRepro",
                column: "updated_by");

            migrationBuilder.CreateIndex(
                name: "IX_tblReproLineItem_account_id",
                table: "tblReproLineItem",
                column: "account_id");

            migrationBuilder.CreateIndex(
                name: "IX_tblReproLineItem_budget_line_id",
                table: "tblReproLineItem",
                column: "budget_line_id");

            migrationBuilder.CreateIndex(
                name: "IX_tblReproLineItem_category_id",
                table: "tblReproLineItem",
                column: "category_id");

            migrationBuilder.CreateIndex(
                name: "IX_tblReproLineItem_grant_id",
                table: "tblReproLineItem",
                column: "grant_id");

            migrationBuilder.CreateIndex(
                name: "IX_tblReproLineItem_initiative_id",
                table: "tblReproLineItem",
                column: "initiative_id");

            migrationBuilder.CreateIndex(
                name: "IX_tblReproLineItem_repro_id_initiative_id_grant_id_category_id_account_id",
                table: "tblReproLineItem",
                columns: new[] { "repro_id", "initiative_id", "grant_id", "category_id", "account_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_tblReproLineItem_updated_by",
                table: "tblReproLineItem",
                column: "updated_by");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tblBudgetComment");

            migrationBuilder.DropTable(
                name: "tblReproLineItem");

            migrationBuilder.DropTable(
                name: "tblBudget");

            migrationBuilder.DropTable(
                name: "tblRepro");

            migrationBuilder.DropTable(
                name: "tblAccount");

            migrationBuilder.DropTable(
                name: "tblGrant");

            migrationBuilder.DropTable(
                name: "tblInitiative");

            migrationBuilder.DropTable(
                name: "tblAuthorizedUsers");

            migrationBuilder.DropTable(
                name: "tblCategory");
        }
    }
}
