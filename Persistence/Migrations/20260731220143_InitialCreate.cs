using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

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
                    end_date = table.Column<DateTime>(type: "datetime2", nullable: false)
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
