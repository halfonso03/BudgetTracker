using System;
using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
// using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Persistence
{
    public class AppDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, int>
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

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ApplicationUser>().ToTable("Auth.tblUsers");
            builder.Entity<ApplicationRole>().ToTable("Auth.tblRoles");
            builder.Entity<IdentityUserRole<int>>().ToTable("Auth.tblUserRoles");
            builder.Entity<IdentityUserClaim<int>>().ToTable("Auth.tblUserClaims");
            builder.Entity<IdentityUserLogin<int>>().ToTable("Auth.tblUserLogins");
            builder.Entity<IdentityRoleClaim<int>>().ToTable("Auth.tblRoleClaims");
            builder.Entity<IdentityUserToken<int>>().ToTable("Auth.tblUserTokens");


            builder.Entity<ReportCategory>().HasData(new List<ReportCategory>()
            {
                new()
                {
                    Id = 1,
                    Name = "NHAC",
                    SortOrder = 1
                }
            });

            builder.Entity<Report>().HasData(new List<Report>()
            {
                new ()
                {
                    Id = 1,
                    Name = "Grant Balance By Initiative and AR",
                    Path = "/GrantBalanceByInitiativeAndAR",
                    CategoryId = 1,
                    Enabled = true,
                    DefaultFileName = "GrantBalanceByInitiativeAndAR"
                },
                new ()
                {
                    Id = 2,
                    Name = "Budget Detail",
                    Path = "/BudgetDetail",
                    CategoryId = 1,
                    Enabled = true,
                    DefaultFileName = "BudgetDetail"
                }
            });

            builder.Entity<ReportParameter>().HasData(new List<ReportParameter>()
            {
                new ()
                {
                    Id = 1,
                    Name = "aiYear",
                    Label = "Year",
                    ReportId = 1,
                    SortOrder = 1,
                    ControlType = "dropdownlist",
                    Enabled = true
                },
                new ()
                {
                    Id = 2,
                    Name = "avcInitiatives",
                    Label = "Initiative",
                    ReportId = 1,
                    SortOrder = 2,
                    ControlType = "checkboxlist",
                    Enabled = true
                },
                new ()
                {
                    Id = 3,
                    Name = "aiYear",
                    Label = "Year",
                    ReportId = 2,
                    SortOrder = 1,
                    ControlType = "dropdownlist",
                    Enabled = true
                },
                new ()
                {
                    Id = 4,
                    Name = "avcGrants",
                    Label = "Grant",
                    ReportId = 2,
                    SortOrder = 2,
                    ControlType = "checkboxlist",
                    DependsOn = "aiYear",
                    Enabled = true
                },
                new ()
                {
                    Id = 5,
                    Name = "aiBudgetCat",
                    Label = "Budget Category",
                    ReportId = 2,
                    SortOrder = 3,
                    ControlType = "dropdownlist",
                    Enabled = true
                },
            });



            builder.Entity<Initiative>().HasData(
                new Initiative() { Id = 1, Name = "Management & Coordination" },
                new Initiative() { Id = 2, Name = "Training" },
                new Initiative() { Id = 3, Name = "ORS" },
                new Initiative() { Id = 4, Name = "Multimedia & Technology Unit" },
                new Initiative() { Id = 5, Name = "DHE" },
                new Initiative() { Id = 6, Name = "Management & Coordination 2" },
                new Initiative() { Id = 7, Name = "Training 2" },
                new Initiative() { Id = 8, Name = "ORS 2" },
                new Initiative() { Id = 9, Name = "Multimedia & Technology Unit 2" },
                new Initiative() { Id = 10, Name = "DHE 3" },
                new Initiative() { Id = 11, Name = "Management & Coordination 3" },
                new Initiative() { Id = 12, Name = "Training 3" },
                new Initiative() { Id = 13, Name = "ORS 3" },
                new Initiative() { Id = 14, Name = "Multimedia & Technology Unit 3" },
                new Initiative() { Id = 15, Name = "DHE 4" },
                new Initiative() { Id = 16, Name = "Management & Coordination 4" },
                new Initiative() { Id = 17, Name = "Training 4" },
                new Initiative() { Id = 18, Name = "ORS 4" },
                new Initiative() { Id = 19, Name = "Multimedia & Technology Unit 4" },
                new Initiative() { Id = 20, Name = "DHE 4" }
            );

            builder.Entity<Grant>().HasData(
                new Grant()
                {
                    Id = 1,
                    StartDate = new DateTime(2025, 1, 1),
                    EndDate = new DateTime(2026, 12, 31),
                    Name = "G25001",
                    Fiduciary = "MSCO",
                    Year = 2025
                },
                new Grant()
                {
                    Id = 2,
                    StartDate = new DateTime(2025, 1, 1),
                    EndDate = new DateTime(2026, 12, 31),
                    Name = "G25002",
                    Fiduciary = "Cameron Co",
                    Year = 2025
                },
                new Grant
                {
                    Id = 3,
                    StartDate = new DateTime(2026, 1, 1),
                    EndDate = new DateTime(2027, 12, 31),
                    Name = "G26001",
                    Fiduciary = "MCSO",
                    Year = 2026
                },
                new Grant
                {
                    Id = 4,
                    StartDate = new DateTime(2026, 1, 1),
                    EndDate = new DateTime(2027, 12, 31),
                    Name = "G26002",
                    Fiduciary = "Cameron Co",
                    Year = 2026
                }
            );



            builder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Personnel" },
                new Category { Id = 2, Name = "Facilities" },
                new Category { Id = 3, Name = "Fringe" },
                new Category { Id = 4, Name = "Equipment" },
                new Category { Id = 5, Name = "Services Contractors" },
                new Category { Id = 6, Name = "Services Vendors" },
                new Category { Id = 7, Name = "Supplies" },
                new Category { Id = 8, Name = "Travel Contractor" },
                new Category { Id = 9, Name = "Travel Agency" }
            );

            builder.Entity<Account>().HasData(
                new Account { Id = 1, Name = "Salaries", CategoryId = 1, Number = "1" },
                new Account { Id = 2, Name = "Janitorial", CategoryId = 2, Number = "1" },
                new Account { Id = 3, Name = "Rentals and Leases", CategoryId = 2, Number = "1" },
                new Account { Id = 4, Name = "Utilities Services - Electric", CategoryId = 2, Number = "1" },
                new Account { Id = 5, Name = "FICA", CategoryId = 3, Number = "1" },
                new Account { Id = 6, Name = "Life & Health Insurance", CategoryId = 3, Number = "1" },
                new Account { Id = 7, Name = "Insurance Fringe", CategoryId = 3, Number = "1" },
                new Account { Id = 8, Name = "Retirement", CategoryId = 3, Number = "1" },
                new Account { Id = 9, Name = "Workers Comp", CategoryId = 3, Number = "1" },
                new Account { Id = 10, Name = "Equipment - Over $5,000", CategoryId = 4, Number = "1" },
                new Account { Id = 11, Name = "Cardwell, Tim", CategoryId = 5, Number = "1" },
                new Account { Id = 12, Name = "Cormier, Jim", CategoryId = 5, Number = "1" },
                new Account { Id = 13, Name = "Doyne, Shaun", CategoryId = 5, Number = "1" },
                new Account { Id = 14, Name = "Eadie, John", CategoryId = 5, Number = "1" },
                new Account { Id = 15, Name = "Hall, Orman", CategoryId = 5, Number = "1" },
                new Account { Id = 16, Name = "Hamby, David", CategoryId = 5, Number = "1" },
                new Account { Id = 17, Name = "Jakim, Christopher", CategoryId = 5, Number = "1" },
                new Account { Id = 18, Name = "Kempton, Emma", CategoryId = 5, Number = "1" },
                new Account { Id = 19, Name = "Quigley, Dale", CategoryId = 5, Number = "1" },
                new Account { Id = 20, Name = "Roggeveen, Rob", CategoryId = 5, Number = "1" },
                new Account { Id = 21, Name = "Salas, Steve", CategoryId = 5, Number = "1" },
                new Account { Id = 22, Name = "Snyders, Mike", CategoryId = 5, Number = "1" },
                new Account { Id = 23, Name = "Tafoya, Martina", CategoryId = 5, Number = "1" },
                new Account { Id = 24, Name = "Insurance Other", CategoryId = 6, Number = "1" },
                new Account { Id = 25, Name = "Freight and Postage Services", CategoryId = 6, Number = "1" },
                new Account { Id = 26, Name = "Communication Services", CategoryId = 6, Number = "1" },
                new Account { Id = 27, Name = "Other Contractual Services", CategoryId = 6, Number = "1" },
                new Account { Id = 28, Name = "Office", CategoryId = 7, Number = "1" },
                new Account { Id = 29, Name = "Software", CategoryId = 7, Number = "1" },
                new Account { Id = 30, Name = "Machinery and Equipment  ($1,000 to $5,000)", CategoryId = 7, Number = "1" },
                new Account { Id = 31, Name = "Travel Contractor", CategoryId = 8, Number = "1" },
                new Account { Id = 32, Name = "Travel Agency", CategoryId = 9, Number = "1" }

            );

            builder.Entity<AuthorizedUser>().HasData(
                    new AuthorizedUser
                    {
                        Id = 1,
                        WindowsLogin = "hialfonso"
                    },
                    new AuthorizedUser
                    {
                        Id = 2,
                        WindowsLogin = "rxleopold"
                    },

                    new AuthorizedUser
                    {
                        Id = 3,
                        WindowsLogin = "rescobar"
                    }
                );

            builder.Entity<BudgetItemType>().HasData(
                new BudgetItemType { ItemType = Globals.ITEM_TYPE_BUDGET },
                new BudgetItemType { ItemType = Globals.ITEM_TYPE_REPRO },
                new BudgetItemType { ItemType = Globals.ITEM_TYPE_DISB }
            );

            builder.Entity<BudgetLineItem>().HasData(
              new BudgetLineItem()
              {
                  AccountId = 1,
                  Amount = 100,
                  CreatedBy = 1,
                  CreateDate = new DateTime(2026, 7, 31, 8, 0, 0),
                  GrantId = 1,
                  InitiativeId = 1,
                  ItemType = Globals.ITEM_TYPE_BUDGET,
                  Id = 1,
                  Year = 2025
              },
              new BudgetLineItem()
              {
                  AccountId = 3,
                  Amount = 100,
                  CreatedBy = 1,
                  CreateDate = new DateTime(2026, 7, 31, 8, 0, 0),
                  GrantId = 1,
                  InitiativeId = 1,
                  ItemType = Globals.ITEM_TYPE_BUDGET,
                  Id = 2,
                  Year = 2025
              },
              new BudgetLineItem()
              {
                  AccountId = 4,
                  Amount = 105,
                  CreatedBy = 1,
                  CreateDate = new DateTime(2026, 7, 31, 8, 0, 0),
                  GrantId = 1,
                  InitiativeId = 1,
                  ItemType = Globals.ITEM_TYPE_BUDGET,
                  Id = 3,
                  Year = 2025
              },
              new BudgetLineItem()
              {
                  AccountId = 7,
                  Amount = 1200,
                  CreatedBy = 1,
                  CreateDate = new DateTime(2026, 7, 31, 8, 0, 0),
                  GrantId = 1,
                  InitiativeId = 1,
                  ItemType = Globals.ITEM_TYPE_BUDGET,
                  Id = 5,
                  Year = 2025
              },
              new BudgetLineItem()
              {
                  AccountId = 8,
                  Amount = 400,
                  CreatedBy = 1,
                  CreateDate = new DateTime(2026, 7, 31, 8, 0, 0),
                  GrantId = 1,
                  InitiativeId = 1,
                  ItemType = Globals.ITEM_TYPE_BUDGET,
                  Id = 6,
                  Year = 2025
              },
              new BudgetLineItem()
              {
                  AccountId = 5,
                  Amount = 596.0M,
                  CreatedBy = 1,
                  CreateDate = new DateTime(2026, 7, 31, 8, 0, 0),
                  GrantId = 1,
                  InitiativeId = 1,
                  ItemType = Globals.ITEM_TYPE_BUDGET,
                  Id = 7,
                  Year = 2025
              },
              new BudgetLineItem()
              {
                  AccountId = 8,
                  Amount = 400,
                  CreatedBy = 1,
                  CreateDate = new DateTime(2026, 7, 31, 8, 0, 0),
                  GrantId = 1,
                  InitiativeId = 2,
                  ItemType = Globals.ITEM_TYPE_BUDGET,
                  Id = 9,
                  Year = 2025
              },
              new BudgetLineItem()
              {
                  AccountId = 5,
                  Amount = 750,
                  CreatedBy = 1,
                  CreateDate = new DateTime(2026, 7, 31, 8, 0, 0),
                  GrantId = 3,
                  InitiativeId = 1,
                  ItemType = Globals.ITEM_TYPE_BUDGET,
                  Id = 10,
                  Year = 2026
              },
              new BudgetLineItem()
              {
                  AccountId = 8,
                  Amount = 250,
                  CreatedBy = 1,
                  CreateDate = new DateTime(2026, 7, 31, 8, 0, 0),
                  GrantId = 3,
                  InitiativeId = 2,
                  ItemType = Globals.ITEM_TYPE_BUDGET,
                  Id = 11,
                  Year = 2026
              },
               new BudgetLineItem()
               {
                   AccountId = 8,
                   Amount = 250,
                   CreatedBy = 1,
                   CreateDate = new DateTime(2026, 7, 31, 8, 0, 0),
                   GrantId = 3,
                   InitiativeId = 2,
                   ItemType = Globals.ITEM_TYPE_BUDGET,
                   Id = 12,
                   Year = 2026
               },
            new BudgetLineItem()
            {
                AccountId = 1,
                Amount = -50,
                CreatedBy = 1,
                CreateDate = new DateTime(2026, 7, 31, 8, 0, 0),
                GrantId = 1,
                InitiativeId = 1,
                ItemType = Globals.ITEM_TYPE_DISB,
                Id = 13,
                Year = 2025
            }
          );

            builder.Entity<Category>()
                .HasMany(x => x.Accounts)
                .WithOne(x => x.Category)
                .HasForeignKey(x => x.CategoryId);

            builder.Entity<AuthorizedUser>().Property(x => x.Id).HasColumnName("id");
            builder.Entity<AuthorizedUser>().Property(x => x.WindowsLogin).HasColumnName("windows_login").HasColumnType("VARCHAR(50)");
            builder.Entity<AuthorizedUser>().Property(x => x.LastLoginDate).HasColumnName("last_login_date").HasColumnType("datetime");

            builder.Entity<Account>().Property(x => x.Id).HasColumnName("id");
            builder.Entity<Account>().Property(x => x.Number).HasColumnName("number").HasColumnType("VARCHAR(50)");
            builder.Entity<Account>().Property(x => x.Name).HasColumnName("name").HasColumnType("VARCHAR(500)"); ;
            builder.Entity<Account>().Property(x => x.CategoryId).HasColumnName("category_id");

            builder.Entity<Category>().Property(x => x.Id).HasColumnName("id");
            builder.Entity<Category>().Property(x => x.Name).HasColumnName("name").HasColumnType("VARCHAR(50)"); ;

            builder.Entity<Initiative>().Property(x => x.Id).HasColumnName("id");
            builder.Entity<Initiative>().Property(x => x.Name).HasColumnName("name").HasColumnType("VARCHAR(200)"); ;

            builder.Entity<Grant>().Property(x => x.Id).HasColumnName("id");
            builder.Entity<Grant>().Property(x => x.StartDate).HasColumnName("start_date");
            builder.Entity<Grant>().Property(x => x.EndDate).HasColumnName("end_date");
            builder.Entity<Grant>().Property(x => x.Fiduciary).HasColumnName("fiduciary");

            builder.Entity<Grant>().Property(x => x.Name).HasColumnName("name").HasColumnType("VARCHAR(50)"); ;

            builder.Entity<BudgetItemType>().Property(x => x.ItemType).HasColumnName("item_type").HasColumnType("CHAR(1)");

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

            builder.Entity<Disb>()
                    .HasOne(x => x.Grant)
                    .WithMany(x => x.Disbs)
                    .HasForeignKey(x => x.GrantId)
                    .OnDelete(DeleteBehavior.NoAction);

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
            builder.Entity<Disb>().Property(x => x.GrantId).HasColumnName("grant_id");


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
                        .HasIndex(a => new { a.DisbId, a.InitiativeId, a.GrantId, a.CategoryId, a.AccountId })
                        .IsUnique();


            builder.Entity<Report>().Property(x => x.Name).HasColumnType("VARCHAR(200)");
            builder.Entity<Report>().Property(x => x.Path).HasColumnType("VARCHAR(1000)");

            builder.Entity<ReportParameter>().Property(x => x.Name).HasColumnType("VARCHAR(75)");

            builder.Entity<ReportParameter>()
                       .HasIndex(a => new { a.ReportId, a.SortOrder })
                       .IsUnique();


            builder.Entity<ReportCategory>().Property(x => x.Name).HasColumnType("VARCHAR(50)");
        }
    }
}