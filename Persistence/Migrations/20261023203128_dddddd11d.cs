using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class dddddd11d : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "LastLoginInDate",
                schema: "Auth",
                table: "tblUsers",
                newName: "LastLoginDate");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "LastLoginDate",
                schema: "Auth",
                table: "tblUsers",
                newName: "LastLoginInDate");
        }
    }
}
