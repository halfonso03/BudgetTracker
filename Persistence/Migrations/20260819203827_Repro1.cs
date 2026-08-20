using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Repro1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "tblRepro",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    create_date = table.Column<DateTime>(type: "DATETIME", nullable: false),
                    created_by = table.Column<int>(type: "int", nullable: false),
                    posted = table.Column<bool>(type: "bit", nullable: false),
                    posted_by = table.Column<int>(type: "int", nullable: false),
                    posted_date = table.Column<DateTime>(type: "DATETIME", nullable: true),
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
                        principalColumn: "id",
                        onDelete: ReferentialAction.NoAction);
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
                    entry_date = table.Column<DateTime>(type: "DATETIME", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblReproLineItem", x => x.id);
                    table.ForeignKey(
                        name: "FK_tblReproLineItem_tblRepro_repro_id",
                        column: x => x.repro_id,
                        principalTable: "tblRepro",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_tblRepro_created_by",
                table: "tblRepro",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "IX_tblRepro_posted_by",
                table: "tblRepro",
                column: "posted_by");

            migrationBuilder.CreateIndex(
                name: "IX_tblReproLineItem_repro_id",
                table: "tblReproLineItem",
                column: "repro_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tblReproLineItem");

            migrationBuilder.DropTable(
                name: "tblRepro");
        }
    }
}
