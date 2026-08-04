using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
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
                    windows_login = table.Column<string>(type: "varchar(50)", nullable: false),
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
                    name = table.Column<string>(type: "varchar(50)", nullable: false)
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
                    name = table.Column<string>(type: "varchar(50)", nullable: false),
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
                    name = table.Column<string>(type: "varchar(200)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblInitiative", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "tblAccount",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "varchar(500)", nullable: false),
                    number = table.Column<string>(type: "varchar(50)", nullable: false),
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
                    amount = table.Column<double>(type: "float", nullable: false),
                    item_type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    created_by = table.Column<int>(type: "int", nullable: false),
                    create_date = table.Column<DateTime>(type: "datetime", nullable: false),
                    updated_by = table.Column<int>(type: "int", nullable: true),
                    update_date = table.Column<DateTime>(type: "datetime", nullable: true)
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

            migrationBuilder.InsertData(
                table: "tblAuthorizedUsers",
                columns: new[] { "id", "last_login_date", "windows_login" },
                values: new object[] { 1, null, "halfonso" });

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
                    { 3, new DateTime(2027, 12, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), "MCSPo", "G26001", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 4, new DateTime(2027, 12, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), "Cameron Co", "G26002", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) }
                });

            migrationBuilder.InsertData(
                table: "tblInitiative",
                columns: new[] { "id", "name" },
                values: new object[,]
                {
                    { 1, "Management & Coordination" },
                    { 2, "Training" },
                    { 3, "Multemedia & Technology" }
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
                    { 1, 1, 100.0, new DateTime(2026, 7, 31, 8, 0, 0, 0, DateTimeKind.Unspecified), 1, 1, 1, "B", null, null },
                    { 2, 3, 100.0, new DateTime(2026, 7, 31, 8, 0, 0, 0, DateTimeKind.Unspecified), 1, 1, 1, "B", null, null },
                    { 3, 4, 105.0, new DateTime(2026, 7, 31, 8, 0, 0, 0, DateTimeKind.Unspecified), 1, 1, 1, "B", null, null },
                    { 4, 4, 105.0, new DateTime(2026, 7, 31, 8, 0, 0, 0, DateTimeKind.Unspecified), 1, 1, 1, "B", null, null },
                    { 5, 7, 1200.0, new DateTime(2026, 7, 31, 8, 0, 0, 0, DateTimeKind.Unspecified), 1, 1, 1, "B", null, null },
                    { 6, 8, 400.0, new DateTime(2026, 7, 31, 8, 0, 0, 0, DateTimeKind.Unspecified), 1, 1, 1, "B", null, null },
                    { 7, 5, 596.00999999999999, new DateTime(2026, 7, 31, 8, 0, 0, 0, DateTimeKind.Unspecified), 1, 1, 1, "B", null, null },
                    { 8, 5, 596.00999999999999, new DateTime(2026, 7, 31, 8, 0, 0, 0, DateTimeKind.Unspecified), 1, 1, 1, "B", null, null },
                    { 9, 8, 400.0, new DateTime(2026, 7, 31, 8, 0, 0, 0, DateTimeKind.Unspecified), 1, 1, 2, "B", null, null }
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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tblBudget");

            migrationBuilder.DropTable(
                name: "tblAccount");

            migrationBuilder.DropTable(
                name: "tblAuthorizedUsers");

            migrationBuilder.DropTable(
                name: "tblGrant");

            migrationBuilder.DropTable(
                name: "tblInitiative");

            migrationBuilder.DropTable(
                name: "tblCategory");
        }
    }
}
