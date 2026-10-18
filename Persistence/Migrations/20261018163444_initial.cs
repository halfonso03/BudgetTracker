using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Audit");

            migrationBuilder.EnsureSchema(
                name: "Report");

            migrationBuilder.EnsureSchema(
                name: "Auth");

            migrationBuilder.CreateTable(
                name: "tblAuthorizedUsers",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    windows_login = table.Column<string>(type: "VARCHAR(50)", nullable: false),
                    last_login_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblAuthorizedUsers", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "tblBudgetItemType",
                columns: table => new
                {
                    item_type = table.Column<string>(type: "CHAR(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblBudgetItemType", x => x.item_type);
                });

            migrationBuilder.CreateTable(
                name: "tblCategory",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "VARCHAR(50)", nullable: false),
                    sort_order = table.Column<int>(type: "int", nullable: false)
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
                    Year = table.Column<int>(type: "int", nullable: false),
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
                name: "tblReportCategory",
                schema: "Report",
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
                name: "tblRoles",
                schema: "Auth",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "tblUsers",
                schema: "Auth",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblUsers", x => x.Id);
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
                name: "tblReport",
                schema: "Report",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "VARCHAR(200)", nullable: false),
                    path = table.Column<string>(type: "VARCHAR(1000)", nullable: false),
                    category_id = table.Column<byte>(type: "tinyint", nullable: false),
                    enabled = table.Column<bool>(type: "bit", nullable: false),
                    default_download_filename = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblReport", x => x.id);
                    table.ForeignKey(
                        name: "FK_tblReport_tblReportCategory_category_id",
                        column: x => x.category_id,
                        principalSchema: "Report",
                        principalTable: "tblReportCategory",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Auth.tblRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<int>(type: "int", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Auth.tblRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Auth.tblRoleClaims_tblRoles_RoleId",
                        column: x => x.RoleId,
                        principalSchema: "Auth",
                        principalTable: "tblRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Auth.tblUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Auth.tblUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Auth.tblUserClaims_tblUsers_UserId",
                        column: x => x.UserId,
                        principalSchema: "Auth",
                        principalTable: "tblUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Auth.tblUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Auth.tblUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_Auth.tblUserLogins_tblUsers_UserId",
                        column: x => x.UserId,
                        principalSchema: "Auth",
                        principalTable: "tblUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Auth.tblUserRoles",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    RoleId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Auth.tblUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_Auth.tblUserRoles_tblRoles_RoleId",
                        column: x => x.RoleId,
                        principalSchema: "Auth",
                        principalTable: "tblRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Auth.tblUserRoles_tblUsers_UserId",
                        column: x => x.UserId,
                        principalSchema: "Auth",
                        principalTable: "tblUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Auth.tblUserTokens",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Auth.tblUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_Auth.tblUserTokens_tblUsers_UserId",
                        column: x => x.UserId,
                        principalSchema: "Auth",
                        principalTable: "tblUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tblBudgetHeader",
                columns: table => new
                {
                    initiative_id = table.Column<int>(type: "int", nullable: false),
                    grant_id = table.Column<int>(type: "int", nullable: false),
                    update_date = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    updated_by = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblBudgetHeader", x => new { x.initiative_id, x.grant_id });
                    table.ForeignKey(
                        name: "FK_tblBudgetHeader_tblGrant_grant_id",
                        column: x => x.grant_id,
                        principalTable: "tblGrant",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tblBudgetHeader_tblInitiative_initiative_id",
                        column: x => x.initiative_id,
                        principalTable: "tblInitiative",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tblBudgetHeader_tblUsers_updated_by",
                        column: x => x.updated_by,
                        principalSchema: "Auth",
                        principalTable: "tblUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "tblDisb",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    year = table.Column<int>(type: "int", nullable: false),
                    create_date = table.Column<DateTime>(type: "DATETIME2", nullable: false),
                    created_by = table.Column<int>(type: "int", nullable: false),
                    updated_by = table.Column<int>(type: "int", nullable: true),
                    posted = table.Column<bool>(type: "bit", nullable: false),
                    posted_by = table.Column<int>(type: "int", nullable: true),
                    posted_date = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    updated_date = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    amount = table.Column<decimal>(type: "NUMERIC(15,2)", nullable: false),
                    justification = table.Column<string>(type: "VARCHAR(MAX)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblDisb", x => x.id);
                    table.ForeignKey(
                        name: "FK_tblDisb_tblUsers_created_by",
                        column: x => x.created_by,
                        principalSchema: "Auth",
                        principalTable: "tblUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tblDisb_tblUsers_posted_by",
                        column: x => x.posted_by,
                        principalSchema: "Auth",
                        principalTable: "tblUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_tblDisb_tblUsers_updated_by",
                        column: x => x.updated_by,
                        principalSchema: "Auth",
                        principalTable: "tblUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "tblRepro",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    year = table.Column<int>(type: "int", nullable: false),
                    create_date = table.Column<DateTime>(type: "DATETIME2", nullable: false),
                    created_by = table.Column<int>(type: "int", nullable: false),
                    updated_by = table.Column<int>(type: "int", nullable: true),
                    posted = table.Column<bool>(type: "bit", nullable: false),
                    posted_by = table.Column<int>(type: "int", nullable: true),
                    posted_date = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    updated_date = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    amount = table.Column<decimal>(type: "NUMERIC(15,2)", nullable: false),
                    justification = table.Column<string>(type: "VARCHAR(MAX)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblRepro", x => x.id);
                    table.ForeignKey(
                        name: "FK_tblRepro_tblUsers_created_by",
                        column: x => x.created_by,
                        principalSchema: "Auth",
                        principalTable: "tblUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tblRepro_tblUsers_posted_by",
                        column: x => x.posted_by,
                        principalSchema: "Auth",
                        principalTable: "tblUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_tblRepro_tblUsers_updated_by",
                        column: x => x.updated_by,
                        principalSchema: "Auth",
                        principalTable: "tblUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "tblBudget",
                schema: "Audit",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    initiative_id = table.Column<int>(type: "int", nullable: false),
                    grant_id = table.Column<int>(type: "int", nullable: false),
                    account_id = table.Column<int>(type: "int", nullable: false),
                    amount = table.Column<decimal>(type: "NUMERIC(15,2)", nullable: false),
                    item_type = table.Column<string>(type: "CHAR(1)", nullable: false),
                    year = table.Column<short>(type: "SMALLINT", nullable: false),
                    created_by = table.Column<int>(type: "int", nullable: false),
                    create_date = table.Column<DateTime>(type: "DATETIME2", nullable: false),
                    additional_information = table.Column<string>(type: "VARCHAR(1000)", nullable: true),
                    version = table.Column<string>(type: "VARCHAR(10)", nullable: false)
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
                        name: "FK_tblBudget_tblBudgetItemType_item_type",
                        column: x => x.item_type,
                        principalTable: "tblBudgetItemType",
                        principalColumn: "item_type",
                        onDelete: ReferentialAction.Cascade);
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
                    table.ForeignKey(
                        name: "FK_tblBudget_tblUsers_created_by",
                        column: x => x.created_by,
                        principalSchema: "Auth",
                        principalTable: "tblUsers",
                        principalColumn: "Id",
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
                    entry_date = table.Column<DateTime>(type: "DATETIME2", nullable: false, defaultValueSql: "GETDATE()"),
                    entry_user_id = table.Column<int>(type: "int", nullable: false),
                    update_date = table.Column<DateTime>(type: "DATETIME2", nullable: true, defaultValueSql: "GETDATE()"),
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
                    table.ForeignKey(
                        name: "FK_tblBudgetComment_tblUsers_entry_user_id",
                        column: x => x.entry_user_id,
                        principalSchema: "Auth",
                        principalTable: "tblUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tblBudgetComment_tblUsers_update_user_id",
                        column: x => x.update_user_id,
                        principalSchema: "Auth",
                        principalTable: "tblUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "tblPayee",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "VARCHAR(250)", nullable: false),
                    account_id = table.Column<int>(type: "int", nullable: false),
                    is_active = table.Column<bool>(type: "bit", nullable: false),
                    additional_information = table.Column<string>(type: "VARCHAR(MAX)", nullable: true),
                    payee_type_id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblPayee", x => x.id);
                    table.ForeignKey(
                        name: "FK_tblPayee_tblAccount_account_id",
                        column: x => x.account_id,
                        principalTable: "tblAccount",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tblReportParamter",
                schema: "Report",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    sort_order = table.Column<byte>(type: "tinyint", nullable: false),
                    name = table.Column<string>(type: "VARCHAR(75)", nullable: false),
                    label = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    report_id = table.Column<int>(type: "int", nullable: false),
                    depends_on = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    enabled = table.Column<bool>(type: "bit", nullable: false),
                    control_type = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblReportParamter", x => x.id);
                    table.ForeignKey(
                        name: "FK_tblReportParamter_tblReport_report_id",
                        column: x => x.report_id,
                        principalSchema: "Report",
                        principalTable: "tblReport",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tblRoleClaims",
                schema: "Auth",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tblRoleClaims_Auth.tblRoleClaims_Id",
                        column: x => x.Id,
                        principalTable: "Auth.tblRoleClaims",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tblUserClaims",
                schema: "Auth",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tblUserClaims_Auth.tblUserClaims_Id",
                        column: x => x.Id,
                        principalTable: "Auth.tblUserClaims",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tblUserLogins",
                schema: "Auth",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_tblUserLogins_Auth.tblUserLogins_LoginProvider_ProviderKey",
                        columns: x => new { x.LoginProvider, x.ProviderKey },
                        principalTable: "Auth.tblUserLogins",
                        principalColumns: new[] { "LoginProvider", "ProviderKey" },
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tblUserRoles",
                schema: "Auth",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    RoleId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_tblUserRoles_Auth.tblUserRoles_UserId_RoleId",
                        columns: x => new { x.UserId, x.RoleId },
                        principalTable: "Auth.tblUserRoles",
                        principalColumns: new[] { "UserId", "RoleId" },
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tblUserTokens",
                schema: "Auth",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_tblUserTokens_Auth.tblUserTokens_UserId_LoginProvider_Name",
                        columns: x => new { x.UserId, x.LoginProvider, x.Name },
                        principalTable: "Auth.tblUserTokens",
                        principalColumns: new[] { "UserId", "LoginProvider", "Name" },
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
                    year = table.Column<short>(type: "SMALLINT", nullable: false),
                    created_by = table.Column<int>(type: "int", nullable: false),
                    create_date = table.Column<DateTime>(type: "DATETIME2", nullable: false),
                    updated_by = table.Column<int>(type: "int", nullable: true),
                    update_date = table.Column<DateTime>(type: "DATETIME2", nullable: true),
                    additional_information = table.Column<string>(type: "VARCHAR(1000)", nullable: true),
                    BudgetHeaderInitiativeId = table.Column<int>(type: "int", nullable: true),
                    BudgetHeaderGrantId = table.Column<int>(type: "int", nullable: true)
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
                        name: "FK_tblBudget_tblBudgetHeader_BudgetHeaderInitiativeId_BudgetHeaderGrantId",
                        columns: x => new { x.BudgetHeaderInitiativeId, x.BudgetHeaderGrantId },
                        principalTable: "tblBudgetHeader",
                        principalColumns: new[] { "initiative_id", "grant_id" });
                    table.ForeignKey(
                        name: "FK_tblBudget_tblBudgetItemType_item_type",
                        column: x => x.item_type,
                        principalTable: "tblBudgetItemType",
                        principalColumn: "item_type",
                        onDelete: ReferentialAction.Cascade);
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
                    table.ForeignKey(
                        name: "FK_tblBudget_tblUsers_created_by",
                        column: x => x.created_by,
                        principalSchema: "Auth",
                        principalTable: "tblUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tblBudget_tblUsers_updated_by",
                        column: x => x.updated_by,
                        principalSchema: "Auth",
                        principalTable: "tblUsers",
                        principalColumn: "Id");
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
                    payee_id = table.Column<int>(type: "int", nullable: false),
                    entry_date = table.Column<DateTime>(type: "DATETIME2", nullable: false),
                    update_date = table.Column<DateTime>(type: "DATETIME2", nullable: true),
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
                        name: "FK_tblDisbLineItem_tblBudget_budget_line_id",
                        column: x => x.budget_line_id,
                        principalTable: "tblBudget",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_tblDisbLineItem_tblCategory_category_id",
                        column: x => x.category_id,
                        principalTable: "tblCategory",
                        principalColumn: "id");
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
                    table.ForeignKey(
                        name: "FK_tblDisbLineItem_tblPayee_payee_id",
                        column: x => x.payee_id,
                        principalTable: "tblPayee",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_tblDisbLineItem_tblUsers_updated_by",
                        column: x => x.updated_by,
                        principalSchema: "Auth",
                        principalTable: "tblUsers",
                        principalColumn: "Id");
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
                    allow_neg_balance = table.Column<bool>(type: "bit", nullable: true),
                    entry_date = table.Column<DateTime>(type: "DATETIME2", nullable: false),
                    update_date = table.Column<DateTime>(type: "DATETIME2", nullable: true),
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
                        name: "FK_tblReproLineItem_tblBudget_budget_line_id",
                        column: x => x.budget_line_id,
                        principalTable: "tblBudget",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_tblReproLineItem_tblCategory_category_id",
                        column: x => x.category_id,
                        principalTable: "tblCategory",
                        principalColumn: "id");
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
                    table.ForeignKey(
                        name: "FK_tblReproLineItem_tblUsers_updated_by",
                        column: x => x.updated_by,
                        principalSchema: "Auth",
                        principalTable: "tblUsers",
                        principalColumn: "Id");
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
                table: "tblBudgetItemType",
                column: "item_type",
                values: new object[]
                {
                    "B",
                    "D",
                    "R"
                });

            migrationBuilder.InsertData(
                table: "tblCategory",
                columns: new[] { "id", "name", "sort_order" },
                values: new object[,]
                {
                    { 1, "Personnel", 1 },
                    { 2, "Facilities", 2 },
                    { 3, "Fringe", 3 },
                    { 4, "Equipment", 4 },
                    { 5, "Services Contractors", 5 },
                    { 6, "Services Vendors", 6 },
                    { 7, "Supplies", 7 },
                    { 8, "Travel Contractor", 8 },
                    { 9, "Travel Agency", 9 }
                });

            migrationBuilder.InsertData(
                table: "tblGrant",
                columns: new[] { "id", "end_date", "fiduciary", "name", "start_date", "Year" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 12, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), "COMS", "G25001", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 2025 },
                    { 2, new DateTime(2026, 12, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), "Cameron Co", "G25002", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 2025 },
                    { 3, new DateTime(2027, 12, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), "MCSO", "G26001", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 2026 },
                    { 4, new DateTime(2027, 12, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), "Cameron Co", "G26002", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 2026 }
                });

            migrationBuilder.InsertData(
                table: "tblInitiative",
                columns: new[] { "id", "name" },
                values: new object[,]
                {
                    { 1, "Management & Coordination" },
                    { 2, "Training" },
                    { 3, "SOR" },
                    { 4, "Multimedia & Technology Unit" },
                    { 5, "HED" },
                    { 6, "TAG" }
                });

            migrationBuilder.InsertData(
                schema: "Report",
                table: "tblReportCategory",
                columns: new[] { "id", "name", "sort_order" },
                values: new object[] { (byte)1, "NHAC", (byte)1 });

            migrationBuilder.InsertData(
                schema: "Auth",
                table: "tblUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "FirstName", "LastName", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { 1, 0, "b0c0b6fc-6995-44b7-ba34-ac6e8c33a9d3", "hialfonso@nhac.org", false, "Hector", "Alfonso", false, null, "HIALFONSO@NHAC.ORG", null, "AQAAAAIAAYagAAAAEMretS6tJQofnGHE6J8YK9Nl9rrAKYe1lzklwWTDO5tyKZaolQg1ViAEkCVTg+Tl7g==", null, false, "b0c0b6fc-6995-44b7-ba34-ac6e8c33a9d3", false, "hialfonso" });

            migrationBuilder.InsertData(
                table: "tblAccount",
                columns: new[] { "id", "category_id", "name", "number" },
                values: new object[,]
                {
                    { 1, 1, "Salaries", "1" },
                    { 2, 2, "Janitorial", "1" },
                    { 3, 2, "Rentals and Leases", "1" },
                    { 4, 2, "Utilities Services - Electric", "1" },
                    { 5, 3, "FICA", "1" },
                    { 6, 3, "Life & Health Insurance", "1" },
                    { 7, 3, "Insurance Fringe", "1" },
                    { 8, 3, "Retirement", "1" },
                    { 9, 3, "Workers Comp", "1" },
                    { 10, 4, "Equipment - Over $5,000", "1" },
                    { 11, 5, "Contractors", "1" },
                    { 12, 6, "Insurance Other", "1" },
                    { 13, 6, "Freight and Postage Services", "1" },
                    { 14, 6, "Communication Services", "1" },
                    { 15, 6, "Other Contractual Services", "1" },
                    { 16, 7, "Office", "1" },
                    { 17, 7, "Software", "1" },
                    { 18, 7, "Machinery and Equipment ($1,000 to $5,000)", "1" },
                    { 19, 8, "Contractor", "1" },
                    { 20, 9, "Agency", "1" }
                });

            migrationBuilder.InsertData(
                table: "tblBudgetHeader",
                columns: new[] { "grant_id", "initiative_id", "updated_by", "update_date" },
                values: new object[,]
                {
                    { 1, 1, null, null },
                    { 2, 1, null, null }
                });

            migrationBuilder.InsertData(
                schema: "Report",
                table: "tblReport",
                columns: new[] { "id", "category_id", "default_download_filename", "enabled", "name", "path" },
                values: new object[,]
                {
                    { 1, (byte)1, "GrantBalanceByInitiativeAndAR", true, "Grant Balance By Initiative and AR", "/GrantBalanceByInitiativeAndAR" },
                    { 2, (byte)1, "BudgetDetail", true, "Budget Detail", "/BudgetDetail" }
                });

            migrationBuilder.InsertData(
                table: "tblBudget",
                columns: new[] { "Id", "account_id", "additional_information", "amount", "BudgetHeaderGrantId", "BudgetHeaderInitiativeId", "create_date", "created_by", "grant_id", "initiative_id", "item_type", "update_date", "updated_by", "year" },
                values: new object[,]
                {
                    { 1, 1, null, 100m, null, null, new DateTime(2026, 7, 31, 8, 0, 0, 0, DateTimeKind.Unspecified), 1, 1, 1, "B", null, null, (short)2025 },
                    { 2, 3, null, 100m, null, null, new DateTime(2026, 7, 31, 8, 0, 0, 0, DateTimeKind.Unspecified), 1, 1, 1, "B", null, null, (short)2025 },
                    { 3, 4, null, 105m, null, null, new DateTime(2026, 7, 31, 8, 0, 0, 0, DateTimeKind.Unspecified), 1, 1, 1, "B", null, null, (short)2025 },
                    { 5, 7, null, 1200m, null, null, new DateTime(2026, 7, 31, 8, 0, 0, 0, DateTimeKind.Unspecified), 1, 1, 1, "B", null, null, (short)2025 },
                    { 6, 8, null, 400m, null, null, new DateTime(2026, 7, 31, 8, 0, 0, 0, DateTimeKind.Unspecified), 1, 1, 1, "B", null, null, (short)2025 },
                    { 7, 5, null, 596.0m, null, null, new DateTime(2026, 7, 31, 8, 0, 0, 0, DateTimeKind.Unspecified), 1, 1, 1, "B", null, null, (short)2025 },
                    { 9, 8, null, 400m, null, null, new DateTime(2026, 7, 31, 8, 0, 0, 0, DateTimeKind.Unspecified), 1, 1, 2, "B", null, null, (short)2025 },
                    { 10, 5, null, 750m, null, null, new DateTime(2026, 7, 31, 8, 0, 0, 0, DateTimeKind.Unspecified), 1, 3, 1, "B", null, null, (short)2026 },
                    { 11, 8, null, 250m, null, null, new DateTime(2026, 7, 31, 8, 0, 0, 0, DateTimeKind.Unspecified), 1, 3, 2, "B", null, null, (short)2026 },
                    { 12, 8, null, 250m, null, null, new DateTime(2026, 7, 31, 8, 0, 0, 0, DateTimeKind.Unspecified), 1, 3, 2, "B", null, null, (short)2026 },
                    { 13, 1, null, -50m, null, null, new DateTime(2026, 7, 31, 8, 0, 0, 0, DateTimeKind.Unspecified), 1, 1, 1, "D", null, null, (short)2025 }
                });

            migrationBuilder.InsertData(
                table: "tblPayee",
                columns: new[] { "id", "account_id", "additional_information", "is_active", "name", "payee_type_id" },
                values: new object[,]
                {
                    { 1, 13, null, true, "Kinkos", 1 },
                    { 2, 13, null, true, "FedEx", 1 },
                    { 3, 13, null, true, "Shipstation", 1 },
                    { 4, 13, null, true, "Navis Pack & Ship", 1 },
                    { 5, 13, null, true, "ShippyPro", 1 },
                    { 6, 13, null, true, "Mimeo", 1 },
                    { 7, 13, null, true, "EasySip", 1 },
                    { 8, 13, null, true, "PackAndShip", 1 },
                    { 9, 14, null, true, "AT & T", 1 },
                    { 10, 14, null, true, "Comcast", 1 },
                    { 11, 14, null, true, "Sunshine", 1 },
                    { 12, 14, null, true, "Motorola", 1 },
                    { 13, 14, null, true, "Voip Comm", 1 },
                    { 14, 19, null, true, "Tom Sanchez", 2 },
                    { 15, 19, null, true, "Marc Greenstien", 2 },
                    { 16, 19, null, true, "Troy Bankert", 2 },
                    { 17, 19, null, true, "Charles Bengston", 2 },
                    { 18, 19, null, true, "Ethan Steigerwald", 2 },
                    { 19, 19, null, true, "Steve Salas", 2 },
                    { 20, 19, null, true, "Tim Cardwell", 2 },
                    { 21, 19, null, true, "Tafoya Martina", 2 },
                    { 22, 19, null, true, "Jim Cormier", 2 },
                    { 23, 19, null, true, "Shaun Doyne", 2 },
                    { 24, 19, null, true, "John Eadie", 2 },
                    { 25, 19, null, true, "Orman Hall", 2 },
                    { 26, 19, null, true, "David Hamby", 2 },
                    { 27, 19, null, true, "Christopher Jakim", 2 },
                    { 28, 19, null, true, "Emma Kempton", 2 },
                    { 29, 19, null, true, "Rob Roggeveen", 2 },
                    { 31, 19, null, true, "Mike Snyders", 2 }
                });

            migrationBuilder.InsertData(
                schema: "Report",
                table: "tblReportParamter",
                columns: new[] { "id", "control_type", "depends_on", "enabled", "label", "name", "report_id", "sort_order" },
                values: new object[,]
                {
                    { 1, "dropdownlist", null, true, "Year", "aiYear", 1, (byte)1 },
                    { 2, "checkboxlist", null, true, "Initiative", "avcInitiatives", 1, (byte)2 },
                    { 3, "dropdownlist", null, true, "Year", "aiYear", 2, (byte)1 },
                    { 4, "checkboxlist", "aiYear", true, "Grant", "avcGrants", 2, (byte)2 },
                    { 5, "dropdownlist", null, true, "Budget Category", "aiBudgetCat", 2, (byte)3 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Auth.tblRoleClaims_RoleId",
                table: "Auth.tblRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_Auth.tblUserClaims_UserId",
                table: "Auth.tblUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Auth.tblUserLogins_UserId",
                table: "Auth.tblUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Auth.tblUserRoles_RoleId",
                table: "Auth.tblUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_tblAccount_category_id",
                table: "tblAccount",
                column: "category_id");

            migrationBuilder.CreateIndex(
                name: "IX_tblBudget_account_id",
                table: "tblBudget",
                column: "account_id");

            migrationBuilder.CreateIndex(
                name: "IX_tblBudget_BudgetHeaderInitiativeId_BudgetHeaderGrantId",
                table: "tblBudget",
                columns: new[] { "BudgetHeaderInitiativeId", "BudgetHeaderGrantId" });

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
                name: "IX_tblBudget_item_type",
                table: "tblBudget",
                column: "item_type");

            migrationBuilder.CreateIndex(
                name: "IX_tblBudget_updated_by",
                table: "tblBudget",
                column: "updated_by");

            migrationBuilder.CreateIndex(
                name: "IX_tblBudget_account_id",
                schema: "Audit",
                table: "tblBudget",
                column: "account_id");

            migrationBuilder.CreateIndex(
                name: "IX_tblBudget_created_by",
                schema: "Audit",
                table: "tblBudget",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "IX_tblBudget_grant_id",
                schema: "Audit",
                table: "tblBudget",
                column: "grant_id");

            migrationBuilder.CreateIndex(
                name: "IX_tblBudget_initiative_id",
                schema: "Audit",
                table: "tblBudget",
                column: "initiative_id");

            migrationBuilder.CreateIndex(
                name: "IX_tblBudget_item_type",
                schema: "Audit",
                table: "tblBudget",
                column: "item_type");

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
                name: "IX_tblBudgetHeader_grant_id",
                table: "tblBudgetHeader",
                column: "grant_id");

            migrationBuilder.CreateIndex(
                name: "IX_tblBudgetHeader_updated_by",
                table: "tblBudgetHeader",
                column: "updated_by");

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
                name: "IX_tblDisbLineItem_disb_id_initiative_id_grant_id_category_id_account_id_payee_id",
                table: "tblDisbLineItem",
                columns: new[] { "disb_id", "initiative_id", "grant_id", "category_id", "account_id", "payee_id" },
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
                name: "IX_tblDisbLineItem_payee_id",
                table: "tblDisbLineItem",
                column: "payee_id");

            migrationBuilder.CreateIndex(
                name: "IX_tblDisbLineItem_updated_by",
                table: "tblDisbLineItem",
                column: "updated_by");

            migrationBuilder.CreateIndex(
                name: "IX_tblPayee_account_id",
                table: "tblPayee",
                column: "account_id");

            migrationBuilder.CreateIndex(
                name: "IX_tblReport_category_id",
                schema: "Report",
                table: "tblReport",
                column: "category_id");

            migrationBuilder.CreateIndex(
                name: "IX_tblReportParamter_report_id_sort_order",
                schema: "Report",
                table: "tblReportParamter",
                columns: new[] { "report_id", "sort_order" },
                unique: true);

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

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                schema: "Auth",
                table: "tblRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_tblUserRoles_RoleId",
                schema: "Auth",
                table: "tblUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                schema: "Auth",
                table: "tblUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                schema: "Auth",
                table: "tblUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tblAuthorizedUsers");

            migrationBuilder.DropTable(
                name: "tblBudget",
                schema: "Audit");

            migrationBuilder.DropTable(
                name: "tblBudgetComment");

            migrationBuilder.DropTable(
                name: "tblDisbLineItem");

            migrationBuilder.DropTable(
                name: "tblReportParamter",
                schema: "Report");

            migrationBuilder.DropTable(
                name: "tblReproLineItem");

            migrationBuilder.DropTable(
                name: "tblRoleClaims",
                schema: "Auth");

            migrationBuilder.DropTable(
                name: "tblUserClaims",
                schema: "Auth");

            migrationBuilder.DropTable(
                name: "tblUserLogins",
                schema: "Auth");

            migrationBuilder.DropTable(
                name: "tblUserRoles",
                schema: "Auth");

            migrationBuilder.DropTable(
                name: "tblUserTokens",
                schema: "Auth");

            migrationBuilder.DropTable(
                name: "tblDisb");

            migrationBuilder.DropTable(
                name: "tblPayee");

            migrationBuilder.DropTable(
                name: "tblReport",
                schema: "Report");

            migrationBuilder.DropTable(
                name: "tblBudget");

            migrationBuilder.DropTable(
                name: "tblRepro");

            migrationBuilder.DropTable(
                name: "Auth.tblRoleClaims");

            migrationBuilder.DropTable(
                name: "Auth.tblUserClaims");

            migrationBuilder.DropTable(
                name: "Auth.tblUserLogins");

            migrationBuilder.DropTable(
                name: "Auth.tblUserRoles");

            migrationBuilder.DropTable(
                name: "Auth.tblUserTokens");

            migrationBuilder.DropTable(
                name: "tblReportCategory",
                schema: "Report");

            migrationBuilder.DropTable(
                name: "tblAccount");

            migrationBuilder.DropTable(
                name: "tblBudgetHeader");

            migrationBuilder.DropTable(
                name: "tblBudgetItemType");

            migrationBuilder.DropTable(
                name: "tblRoles",
                schema: "Auth");

            migrationBuilder.DropTable(
                name: "tblCategory");

            migrationBuilder.DropTable(
                name: "tblGrant");

            migrationBuilder.DropTable(
                name: "tblInitiative");

            migrationBuilder.DropTable(
                name: "tblUsers",
                schema: "Auth");
        }
    }
}
