using System;
using Domain;
using Domain.Views;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
// using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Persistence
{
    public class AppDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, int, ApplicationUserClaim, ApplicationUserRole, ApplicationUserLogin, ApplicationRoleClaim, ApplicationUserToken>
    {
        public required DbSet<AuthorizedUser> AuthorizedUsers { get; set; }
        public required DbSet<Initiative> Initiatives { get; set; }
        public required DbSet<Category> Categories { get; set; }
        public required DbSet<Account> Accounts { get; set; }
        public required DbSet<Grant> Grants { get; set; }
        public required DbSet<BudgetLineItem> BudgetLineItems { get; set; }
        public required DbSet<BudgetComment> BudgetComments { get; set; }
        public required DbSet<Repro> Repros { get; set; }
        public required DbSet<ReproLineItem> ReproLineItems { get; set; }
        public required DbSet<Disb> Disbs { get; set; }
        public required DbSet<DisbLineItem> DisbLineItems { get; set; }
        public required DbSet<Report> Reports { get; set; }
        public required DbSet<ReportParameter> ReportParameters { get; set; }
        public required DbSet<ReportCategory> ReportCategories { get; set; }
        public required DbSet<BudgetItemType> BudgetItemTypes { get; set; }
        public required DbSet<Payee> Payees { get; set; }
        // public required DbSet<Contrator> Contrators { get; set; }
        public required DbSet<PayeeSummary> PayeeSummaries { get; set; }
        public required DbSet<BudgetLineItemAudit> BudgetLineItemAudits { get; set; }
        public required DbSet<BudgetHeader> BudgetHeaders { get; set; }


        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            const string identityScheme = "Auth";

            // Rename tables and assign schema
            builder.Entity<ApplicationUser>(b =>
            {
                b.ToTable("tblUsers", identityScheme);
            });

            builder.Entity<ApplicationRole>(b =>
            {
                b.ToTable("tblRoles", identityScheme);
            });

            builder.Entity<ApplicationUserClaim>(b =>
            {
                b.ToTable("tblUserClaims", identityScheme);
            });

            builder.Entity<ApplicationUserLogin>(b =>
            {
                b.ToTable("tblUserLogins", identityScheme);
            });

            builder.Entity<ApplicationUserRole>(b =>
            {
                b.ToTable("tblUserRoles", identityScheme);
            });

            builder.Entity<ApplicationUserToken>(b =>
            {
                b.ToTable("tblUserTokens", identityScheme);
            });

            builder.Entity<ApplicationRoleClaim>(b =>
            {
                b.ToTable("tblRoleClaims", identityScheme);
            });

            // builder.Entity<ApplicationUser>().ToTable("tblUsers", "Auth");
            // builder.Entity<ApplicationRole>().ToTable("tblRoles", "Auth");
            // builder.Entity<ApplicationUserRole>().ToTable("tblUserRoles", "Auth");
            // builder.Entity<ApplicationUserClaim>().ToTable("tblUserClaims", "Auth");
            // builder.Entity<ApplicationUserLogin>().ToTable("tblUserLogins", "Auth");
            // builder.Entity<ApplicationRoleClaim>().ToTable("tblRoleClaims", "Auth");
            // builder.Entity<ApplicationUserToken>().ToTable("tblUserTokens", "Auth");

            builder.Entity<Category>()
                .HasMany(x => x.Accounts)
                .WithOne(x => x.Category)
                .HasForeignKey(x => x.CategoryId);

            builder.Entity<AuthorizedUser>().Property(x => x.Id).HasColumnName("id");
            builder.Entity<AuthorizedUser>().Property(x => x.WindowsLogin).HasColumnName("windows_login").HasColumnType("VARCHAR(50)");
            builder.Entity<AuthorizedUser>().Property(x => x.LastLoginDate).HasColumnName("last_login_date").HasColumnType("datetime2");

            builder.Entity<Account>().Property(x => x.Id).HasColumnName("id");
            builder.Entity<Account>().Property(x => x.Number).HasColumnName("number").HasColumnType("VARCHAR(50)");
            builder.Entity<Account>().Property(x => x.Name).HasColumnName("name").HasColumnType("VARCHAR(500)"); ;
            builder.Entity<Account>().Property(x => x.CategoryId).HasColumnName("category_id");

            builder.Entity<Category>().Property(x => x.Id).HasColumnName("id");
            builder.Entity<Category>().Property(x => x.SortOrder).HasColumnName("sort_order");
            builder.Entity<Category>().Property(x => x.Name).HasColumnName("name").HasColumnType("VARCHAR(50)");

            builder.Entity<Initiative>().Property(x => x.Id).HasColumnName("id");
            builder.Entity<Initiative>().Property(x => x.Name).HasColumnName("name").HasColumnType("VARCHAR(200)"); ;

            builder.Entity<Grant>().Property(x => x.Id).HasColumnName("id");
            builder.Entity<Grant>().Property(x => x.StartDate).HasColumnName("start_date");
            builder.Entity<Grant>().Property(x => x.EndDate).HasColumnName("end_date");
            builder.Entity<Grant>().Property(x => x.Fiduciary).HasColumnName("fiduciary");

            builder.Entity<Grant>().Property(x => x.Name).HasColumnName("name").HasColumnType("VARCHAR(50)"); ;

            builder.Entity<BudgetItemType>().Property(x => x.ItemType).HasColumnName("item_type").HasColumnType("CHAR(1)");


            builder.Entity<BudgetLineItem>(entity =>
                {
                    // Replace "YourTableName" with the real table name.
                    // The trigger name parameter can be any string representing your database trigger.
                    entity.ToTable("tblBudget", tb => tb.HasTrigger("trg_tblBudget_Update"));
                });

            builder.Entity<BudgetLineItem>().Property(x => x.Year).HasColumnName("year").HasColumnType("SMALLINT");
            builder.Entity<BudgetLineItem>().Property(x => x.Amount).HasColumnName("amount").HasColumnType("NUMERIC(15,2)");
            builder.Entity<BudgetLineItem>().Property(x => x.InitiativeId).HasColumnName("initiative_id");
            builder.Entity<BudgetLineItem>().Property(x => x.GrantId).HasColumnName("grant_id");
            builder.Entity<BudgetLineItem>().Property(x => x.AccountId).HasColumnName("account_id");
            builder.Entity<BudgetLineItem>().Property(x => x.ItemType).HasColumnName("item_type").HasColumnType("CHAR(1)");
            builder.Entity<BudgetLineItem>().Property(x => x.CreateDate).HasColumnName("create_date").HasColumnType("DATETIME2");
            builder.Entity<BudgetLineItem>().Property(x => x.CreatedBy).HasColumnName("created_by");
            builder.Entity<BudgetLineItem>().Property(x => x.UpdateDate).HasColumnName("update_date").HasColumnType("DATETIME2");
            builder.Entity<BudgetLineItem>().Property(x => x.UpdatedBy).HasColumnName("updated_by");
            builder.Entity<BudgetLineItem>().Property(x => x.AdditionalInformation).HasColumnName("additional_information").HasColumnType("VARCHAR(1000)");


            builder.Entity<BudgetComment>().Property(x => x.Text).HasColumnName("comment_text").HasColumnType("VARCHAR(MAX)"); ;
            builder.Entity<BudgetComment>().Property(x => x.EntryDate).HasColumnName("entry_date").HasColumnType("DATETIME2").HasDefaultValueSql("GETDATE()");
            builder.Entity<BudgetComment>().Property(x => x.EntryPersonId).HasColumnName("entry_user_id");
            builder.Entity<BudgetComment>().Property(x => x.UpdateDate).HasColumnName("update_date").HasColumnType("DATETIME2").HasDefaultValueSql("GETDATE()");
            builder.Entity<BudgetComment>().Property(x => x.UpdatePersonId).HasColumnName("update_user_id");

            builder.Entity<BudgetComment>().Property(x => x.InitiativeId).HasColumnName("initiative_id");
            builder.Entity<BudgetComment>().Property(x => x.GrantId).HasColumnName("grant_id");
            builder.Entity<BudgetComment>().Property(x => x.AccountId).HasColumnName("account_id");

            builder.Entity<Repro>().Property(x => x.Id).HasColumnName("id");
            builder.Entity<Repro>().Property(x => x.CreatedDate).HasColumnName("create_date").HasColumnType("DATETIME2");
            builder.Entity<Repro>().Property(x => x.CreatedById).HasColumnName("created_by");
            builder.Entity<Repro>().Property(x => x.UpdateDate).HasColumnName("updated_date").HasColumnType("DATETIME2");
            builder.Entity<Repro>().Property(x => x.UpdatedById).HasColumnName("updated_by");
            builder.Entity<Repro>().Property(x => x.Posted).HasColumnName("posted");
            builder.Entity<Repro>().Property(x => x.PostedById).HasColumnName("posted_by");
            builder.Entity<Repro>().Property(x => x.Year).HasColumnName("year");
            builder.Entity<Repro>().Property(x => x.PostedDate).HasColumnName("posted_date").HasColumnType("DATETIME2");
            builder.Entity<Repro>().Property(x => x.Amount).HasColumnName("amount").HasColumnType("NUMERIC(15,2)");
            builder.Entity<Repro>().Property(x => x.Justification).HasColumnName("justification").HasColumnType("VARCHAR(MAX)");

            builder.Entity<ReproLineItem>().Property(x => x.Id).HasColumnName("id");
            builder.Entity<ReproLineItem>().Property(x => x.ReproId).HasColumnName("repro_id");
            builder.Entity<ReproLineItem>().Property(x => x.RowId).HasColumnName("row_id");
            builder.Entity<ReproLineItem>().Property(x => x.InitiativeId).HasColumnName("initiative_id");
            builder.Entity<ReproLineItem>().Property(x => x.GrantId).HasColumnName("grant_id");
            builder.Entity<ReproLineItem>().Property(x => x.CategoryId).HasColumnName("category_id");
            builder.Entity<ReproLineItem>().Property(x => x.AccountId).HasColumnName("account_id");
            builder.Entity<ReproLineItem>().Property(x => x.Increase).HasColumnName("increase").HasColumnType("NUMERIC(15,2)");
            builder.Entity<ReproLineItem>().Property(x => x.Decrease).HasColumnName("decrease").HasColumnType("NUMERIC(15,2)");
            builder.Entity<ReproLineItem>().Property(x => x.Year).HasColumnName("year");
            builder.Entity<ReproLineItem>().Property(x => x.EntryDate).HasColumnName("entry_date").HasColumnType("DATETIME2");
            builder.Entity<ReproLineItem>().Property(x => x.UpdatedById).HasColumnName("updated_by");
            builder.Entity<ReproLineItem>().Property(x => x.UpdateDate).HasColumnName("update_date").HasColumnType("DATETIME2");
            builder.Entity<ReproLineItem>().Property(x => x.Comment).HasColumnName("comment").HasColumnType("VARCHAR(MAX)");
            builder.Entity<ReproLineItem>().Property(x => x.BudgetLineItemId).HasColumnName("budget_line_id");
            builder.Entity<ReproLineItem>().Property(x => x.AllowNegativeBalance).HasColumnType("bit").HasColumnName("allow_neg_balance");
            builder.Entity<ReproLineItem>()
                        .HasIndex(a => new { a.ReproId, a.InitiativeId, a.GrantId, a.CategoryId, a.AccountId })
                        .IsUnique();

            builder.Entity<ReproLineItem>()
                            .HasOne(x => x.Category)
                            .WithMany(x => x.ReproLineItems)
                            .HasForeignKey(x => x.CategoryId)
                            .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<DisbLineItem>()
                            .HasOne(x => x.Category)
                            .WithMany(x => x.DisbLineItems)
                            .HasForeignKey(x => x.CategoryId)
                            .OnDelete(DeleteBehavior.NoAction);

            // builder.Entity<Disb>()
            //         .HasOne(x => x.Grant)
            //         .WithMany(x => x.Disbs)
            //         .HasForeignKey(x => x.GrantId)
            //         .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<Disb>().Property(x => x.Id).HasColumnName("id");
            builder.Entity<Disb>().Property(x => x.CreatedDate).HasColumnName("create_date").HasColumnType("DATETIME2");
            builder.Entity<Disb>().Property(x => x.CreatedById).HasColumnName("created_by");
            builder.Entity<Disb>().Property(x => x.UpdateDate).HasColumnName("updated_date").HasColumnType("DATETIME2");
            builder.Entity<Disb>().Property(x => x.UpdatedById).HasColumnName("updated_by");
            builder.Entity<Disb>().Property(x => x.Posted).HasColumnName("posted");
            builder.Entity<Disb>().Property(x => x.PostedById).HasColumnName("posted_by");
            builder.Entity<Disb>().Property(x => x.Year).HasColumnName("year");
            builder.Entity<Disb>().Property(x => x.PostedDate).HasColumnName("posted_date").HasColumnType("DATETIME2");
            builder.Entity<Disb>().Property(x => x.Amount).HasColumnName("amount").HasColumnType("NUMERIC(15,2)");
            builder.Entity<Disb>().Property(x => x.Justification).HasColumnName("justification").HasColumnType("VARCHAR(MAX)");
            // builder.Entity<Disb>().Property(x => x.GrantId).HasColumnName("grant_id");


            builder.Entity<DisbLineItem>().Property(x => x.Id).HasColumnName("id");
            builder.Entity<DisbLineItem>().Property(x => x.DisbId).HasColumnName("disb_id");
            builder.Entity<DisbLineItem>().Property(x => x.RowId).HasColumnName("row_id");
            builder.Entity<DisbLineItem>().Property(x => x.InitiativeId).HasColumnName("initiative_id");
            builder.Entity<DisbLineItem>().Property(x => x.GrantId).HasColumnName("grant_id");
            builder.Entity<DisbLineItem>().Property(x => x.CategoryId).HasColumnName("category_id");
            builder.Entity<DisbLineItem>().Property(x => x.AccountId).HasColumnName("account_id");
            builder.Entity<DisbLineItem>().Property(x => x.Amount).HasColumnName("amount").HasColumnType("NUMERIC(15,2)");
            builder.Entity<DisbLineItem>().Property(x => x.Year).HasColumnName("year");
            builder.Entity<DisbLineItem>().Property(x => x.EntryDate).HasColumnName("entry_date").HasColumnType("DATETIME2");
            builder.Entity<DisbLineItem>().Property(x => x.UpdatedById).HasColumnName("updated_by");
            builder.Entity<DisbLineItem>().Property(x => x.UpdateDate).HasColumnName("update_date").HasColumnType("DATETIME2");
            builder.Entity<DisbLineItem>().Property(x => x.Comment).HasColumnName("comment").HasColumnType("VARCHAR(MAX)");
            builder.Entity<DisbLineItem>().Property(x => x.BudgetLineItemId).HasColumnName("budget_line_id");
            builder.Entity<DisbLineItem>()
                        .HasIndex(a => new { a.DisbId, a.InitiativeId, a.GrantId, a.CategoryId, a.AccountId, a.PayeeId })
                        .IsUnique();
            builder.Entity<DisbLineItem>().Property(x => x.PayeeId).HasColumnName("payee_id");


            builder.Entity<Report>().Property(x => x.Name).HasColumnType("VARCHAR(200)");
            builder.Entity<Report>().Property(x => x.Path).HasColumnType("VARCHAR(1000)");

            builder.Entity<ReportParameter>().Property(x => x.Name).HasColumnType("VARCHAR(75)");

            builder.Entity<ReportParameter>()
                       .HasIndex(a => new { a.ReportId, a.SortOrder })
                       .IsUnique();

            builder.Entity<ReportCategory>().Property(x => x.Name).HasColumnType("VARCHAR(50)");

            builder.Entity<Payee>().Property(x => x.Id).HasColumnName("id");
            builder.Entity<Payee>().Property(x => x.Name).HasColumnType("VARCHAR(250)").HasColumnName("name");
            builder.Entity<Payee>().Property(x => x.AccountId).HasColumnName("account_id");
            builder.Entity<Payee>().Property(x => x.IsActive).HasColumnName("is_active").HasColumnType("bit");
            builder.Entity<Payee>().Property(x => x.PayeeTypeId).HasColumnName("payee_type_id");
            builder.Entity<Payee>().Property(x => x.AdditionalInformation).HasColumnName("additional_information").HasColumnType("VARCHAR(MAX)");

            builder.Entity<DisbLineItem>()
                       .HasOne(x => x.Payee)
                       .WithMany(x => x.DisbLineItems)
                       .HasForeignKey(x => x.PayeeId)
                       .OnDelete(DeleteBehavior.NoAction);


            builder.Entity<PayeeSummary>()
                  .ToView("vwPayeeSummary") // Name of your SQL view
                  .HasNoKey();


            builder.Entity<PayeeSummary>().Property(x => x.TotalPaid).HasColumnType("NUMERIC(15,2)");
            builder.Entity<PayeeSummary>().Property(x => x.LastPaymentAmount).HasColumnType("NUMERIC(15,2)");

            builder.Entity<BudgetLineItemAudit>().Property(x => x.Year).HasColumnName("year").HasColumnType("SMALLINT");
            builder.Entity<BudgetLineItemAudit>().Property(x => x.Amount).HasColumnName("amount").HasColumnType("NUMERIC(15,2)");
            builder.Entity<BudgetLineItemAudit>().Property(x => x.InitiativeId).HasColumnName("initiative_id");
            builder.Entity<BudgetLineItemAudit>().Property(x => x.GrantId).HasColumnName("grant_id");
            builder.Entity<BudgetLineItemAudit>().Property(x => x.AccountId).HasColumnName("account_id");
            builder.Entity<BudgetLineItemAudit>().Property(x => x.ItemType).HasColumnName("item_type").HasColumnType("CHAR(1)");
            builder.Entity<BudgetLineItemAudit>().Property(x => x.CreateDate).HasColumnName("create_date").HasColumnType("DATETIME2");
            builder.Entity<BudgetLineItemAudit>().Property(x => x.CreatedBy).HasColumnName("created_by");
            builder.Entity<BudgetLineItemAudit>().Property(x => x.AdditionalInformation).HasColumnName("additional_information").HasColumnType("VARCHAR(1000)");
            builder.Entity<BudgetLineItemAudit>().Property(x => x.Version).HasColumnName("version").HasColumnType("VARCHAR(20)");


            builder.Entity<BudgetHeader>().Property(x => x.InitiativeId).HasColumnName("initiative_id");
            builder.Entity<BudgetHeader>().Property(x => x.GrantId).HasColumnName("grant_id");
            builder.Entity<BudgetHeader>().Property(x => x.UpdatedBy).HasColumnName("updated_by");
            builder.Entity<BudgetHeader>().HasKey(x => new { x.InitiativeId, x.GrantId });
            builder.Entity<BudgetHeader>().Property(x => x.UpdatedDate).HasColumnName("update_date").HasColumnType("DATETIME2");

            DataSeeder.SeedData(builder, "hialfonso@nhac.org");
        }
    }
}