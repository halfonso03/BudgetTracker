using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Reports : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "tblReportCategory",
                columns: table => new
                {
                    id = table.Column<byte>(type: "tinyint", nullable: false),
                    name = table.Column<string>(type: "VARCHAR(50)", nullable: false),
                    sort_order = table.Column<byte>(type: "tinyint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblReportCategory", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "tblReport",
                columns: table => new
                {
                    id = table.Column<byte>(type: "tinyint", nullable: false),
                    name = table.Column<string>(type: "VARCHAR(200)", nullable: false),
                    path = table.Column<string>(type: "VARCHAR(1000)", nullable: false),
                    category_id = table.Column<byte>(type: "tinyint", nullable: false),
                    enabled = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblReport", x => x.id);
                    table.ForeignKey(
                        name: "FK_tblReport_tblReportCategory_category_id",
                        column: x => x.category_id,
                        principalTable: "tblReportCategory",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tblReportParamter",
                columns: table => new
                {
                    id = table.Column<byte>(type: "tinyint", nullable: false),
                    sort_order = table.Column<byte>(type: "tinyint", nullable: false),
                    name = table.Column<string>(type: "VARCHAR(75)", nullable: false),
                    label = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    report_id = table.Column<byte>(type: "tinyint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblReportParamter", x => x.id);
                    table.ForeignKey(
                        name: "FK_tblReportParamter_tblReport_report_id",
                        column: x => x.report_id,
                        principalTable: "tblReport",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_tblReport_category_id",
                table: "tblReport",
                column: "category_id");

            migrationBuilder.CreateIndex(
                name: "IX_tblReportParamter_report_id_sort_order",
                table: "tblReportParamter",
                columns: new[] { "report_id", "sort_order" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tblReportParamter");

            migrationBuilder.DropTable(
                name: "tblReport");

            migrationBuilder.DropTable(
                name: "tblReportCategory");
        }
    }
}
