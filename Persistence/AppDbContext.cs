using System;
using Domain;
using Domain.Views;
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
        public required DbSet<Payee> Payees { get; set; }
        public required DbSet<Contrator> Contrators { get; set; }
        public required DbSet<PayeeSummary> PayeeSummaries { get; set; }

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
                new Initiative() { Id = 6, Name = "DTAG" }
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


            /// //////////////////////////////////
            /// CATEGORIES
            /// //////////////////////////////////
            builder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Personnel", SortOrder = 1 },
                new Category { Id = 2, Name = "Facilities", SortOrder = 2 },
                new Category { Id = 3, Name = "Fringe", SortOrder = 3 },
                new Category { Id = 4, Name = "Equipment", SortOrder = 4 },
                new Category { Id = 5, Name = "Services Contractors", SortOrder = 5 },
                new Category { Id = 6, Name = "Services Contractors", SortOrder = 6 },
                new Category { Id = 7, Name = "Supplies", SortOrder = 7 },
                new Category { Id = 8, Name = "Travel Contractor", SortOrder = 8 },
                new Category { Id = 9, Name = "Travel Agency", SortOrder = 9 }
            );

            // Personnel
            builder.Entity<Account>().HasData(
                new Account { Id = 1, Name = "Salaries", CategoryId = 1, Number = "1" }
            );

            // Facilities
            builder.Entity<Account>().HasData(
                new Account { Id = 2, Name = "Janitorial", CategoryId = 2, Number = "1" },
                new Account { Id = 3, Name = "Rentals and Leases", CategoryId = 2, Number = "1" },
                new Account { Id = 4, Name = "Utilities Services - Electric", CategoryId = 2, Number = "1" }
            );

            // Fringe
            builder.Entity<Account>().HasData(
               new Account { Id = 5, Name = "FICA", CategoryId = 3, Number = "1" },
               new Account { Id = 6, Name = "Life & Health Insurance", CategoryId = 3, Number = "1" },
               new Account { Id = 7, Name = "Insurance Fringe", CategoryId = 3, Number = "1" },
               new Account { Id = 8, Name = "Retirement", CategoryId = 3, Number = "1" },
               new Account { Id = 9, Name = "Workers Comp", CategoryId = 3, Number = "1" }
            );

            // Equipment
            builder.Entity<Account>().HasData(
               new Account { Id = 10, Name = "Equipment - Over $5,000", CategoryId = 4, Number = "1" }
            );

            // Services Contractors
            builder.Entity<Account>().HasData(
              new Account { Id = 11, Name = "Contractors", CategoryId = 5, Number = "1" }
            );

            // Services Payees
            builder.Entity<Account>().HasData(
                new Account { Id = 12, Name = "Insurance Other", CategoryId = 6, Number = "1" },
                new Account { Id = 13, Name = "Freight and Postage Services", CategoryId = 6, Number = "1" },
                new Account { Id = 14, Name = "Communication Services", CategoryId = 6, Number = "1" },
                new Account { Id = 15, Name = "Other Contractual Services", CategoryId = 6, Number = "1" }
            );

            // Supplies
            builder.Entity<Account>().HasData(
                new Account { Id = 16, Name = "Office", CategoryId = 7, Number = "1" },
                new Account { Id = 17, Name = "Software", CategoryId = 7, Number = "1" },
                new Account { Id = 18, Name = "Machinery and Equipment ($1,000 to $5,000)", CategoryId = 7, Number = "1" }
            );

            // Travel Contractor
            builder.Entity<Account>().HasData(
                new Account { Id = 19, Name = "Contractor", CategoryId = 8, Number = "1" }
            );

            // Travel Agency
            builder.Entity<Account>().HasData(
                new Account { Id = 20, Name = "Agency", CategoryId = 9, Number = "1" }
            );


            // //////////////////////////////
            // Expenditure Center
            // //////////////////////////////

            //  25 - Services  - Freight and Postage Services
            builder.Entity<Payee>().HasData(
                new Payee() { Id = 1, Name = "Kinkos", AccountId = 13, IsActive = true },
                new Payee() { Id = 2, Name = "FedEx", AccountId = 13, IsActive = true },
                new Payee() { Id = 3, Name = "Shipstation", AccountId = 13, IsActive = true },
                new Payee() { Id = 4, Name = "Navis Pack & Ship", AccountId = 13, IsActive = true },
                new Payee() { Id = 5, Name = "ShippyPro", AccountId = 13, IsActive = true },
                new Payee() { Id = 6, Name = "Mimeo", AccountId = 13, IsActive = true },
                new Payee() { Id = 7, Name = "EasySip", AccountId = 13, IsActive = true },
                new Payee() { Id = 8, Name = "PackAndShip", AccountId = 13, IsActive = true }
            );


            //  26 -Services -  Communication Services
            builder.Entity<Payee>().HasData(
                new Payee() { Id = 9, Name = "AT & T", AccountId = 14, IsActive = true },
                new Payee() { Id = 10, Name = "Comcast", AccountId = 14, IsActive = true },
                new Payee() { Id = 11, Name = "Sunshine", AccountId = 14, IsActive = true },
                new Payee() { Id = 12, Name = "Motorola", AccountId = 14, IsActive = true },
                new Payee() { Id = 13, Name = "Voip Comm", AccountId = 14, IsActive = true },
                new Payee() { Id = 14, Name = "Tom Sanchez", AccountId = 19, IsActive = true },
                new Payee() { Id = 15, Name = "Marc Greenstien", AccountId = 19, IsActive = true },
                new Payee() { Id = 16, Name = "Troy Bankert", AccountId = 19, IsActive = true },
                new Payee() { Id = 17, Name = "Charles Bengston", AccountId = 19, IsActive = true },
                new Payee() { Id = 18, Name = "Ethan Steigerwald", AccountId = 19, IsActive = true },
                new Payee() { Id = 19, Name = "Steve Sales", AccountId = 19, IsActive = true },
                new Payee() { Id = 20, Name = "Tim Cardwell", AccountId = 19, IsActive = true },
                new Payee() { Id = 21, Name = "Tafoya Martina", AccountId = 19, IsActive = true },
                new Payee() { Id = 22, Name = "Jim Cormier", AccountId = 19, IsActive = true },
                new Payee() { Id = 23, Name = "Shaun Doyne", AccountId = 19, IsActive = true },
                new Payee() { Id = 24, Name = "John Eadie", AccountId = 19, IsActive = true },
                new Payee() { Id = 25, Name = "Orman Hall", AccountId = 19, IsActive = true },
                new Payee() { Id = 26, Name = "David Hamby", AccountId = 19, IsActive = true },
                new Payee() { Id = 27, Name = "Christopher Jakim", AccountId = 19, IsActive = true },
                new Payee() { Id = 28, Name = "Emma Kempton", AccountId = 19, IsActive = true },
                new Payee() { Id = 29, Name = "Rob Roggeveen", AccountId = 19, IsActive = true },
                new Payee() { Id = 30, Name = "Steve Salas", AccountId = 19, IsActive = true },
                new Payee() { Id = 31, Name = "Mike Snyders", AccountId = 19, IsActive = true }
            );


            // // 31 -  Travel Contractor - Contractor
            // builder.Entity<Contrator>().HasData(
            //     new Contrator() { Id = 1, FirstName = "Tom", LastName = "Sanchez", Email = "tsanchez@nhac.org", AccountId = 19, IsActive = true },
            //     new Contrator() { Id = 2, FirstName = "Marc", LastName = "Greenstien", Email = "mreenstien@nhac.org", AccountId = 19, IsActive = true },
            //     new Contrator() { Id = 3, FirstName = "Troy", LastName = "Bankert", Email = "tankert@nhac.org", AccountId = 19, IsActive = true },
            //     new Contrator() { Id = 4, FirstName = "Charles", LastName = "Bengston", Email = "cengston@nhac.org", AccountId = 19, IsActive = true },
            //     new Contrator() { Id = 5, FirstName = "Ethan", LastName = "Steigerwald", Email = "esteigerwald@nhac.org", AccountId = 19, IsActive = true },
            //     new Contrator() { Id = 6, FirstName = "Steve", LastName = "Sales", Email = "ssales@nhac.org", AccountId = 19, IsActive = true },
            //     new Contrator() { Id = 7, FirstName = "Tim", LastName = "Cardwell", Email = "tcardwell@nhac.org", AccountId = 19, IsActive = true },
            //     new Contrator() { Id = 8, FirstName = "Tafoya", LastName = "Martina", Email = "tmartine@nhac.org", AccountId = 19, IsActive = true },
            //     new Contrator() { Id = 9, FirstName = "Jim", LastName = "Cormier", Email = "jcormier@nhac.org", AccountId = 19, IsActive = true },
            //     new Contrator() { Id = 10, FirstName = "Shaun", LastName = "Doyne", Email = "sdoyne@nhac.org", AccountId = 19, IsActive = true },
            //     new Contrator() { Id = 11, FirstName = "John", LastName = "Eadie", Email = "jeadie@nhac.org", AccountId = 19, IsActive = true },
            //     new Contrator() { Id = 12, FirstName = "Orman", LastName = "Hall", Email = "ohall@nhac.org", AccountId = 19, IsActive = true },
            //     new Contrator() { Id = 13, FirstName = "David", LastName = "Hamby", Email = "dhamby@nhac.org", AccountId = 19, IsActive = true },
            //     new Contrator() { Id = 14, FirstName = "Christopher", LastName = "Jakim", Email = "cjakim@nhac.org", AccountId = 19, IsActive = true },
            //     new Contrator() { Id = 15, FirstName = "Emma", LastName = "Kempton", Email = "ekempton@nhac.org", AccountId = 19, IsActive = true },
            //     new Contrator() { Id = 16, FirstName = "Rob", LastName = "Roggeveen", Email = "rroggeveen@nhac.org", AccountId = 19, IsActive = true },
            //     new Contrator() { Id = 17, FirstName = "Steve", LastName = "Salas", Email = "ssales@nhac.org", AccountId = 19, IsActive = true },
            //     new Contrator() { Id = 18, FirstName = "Mike", LastName = "Snyders", Email = "msnyders@nhac.org", AccountId = 19, IsActive = true }
            // );





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
            builder.Entity<Contrator>().Property(x => x.Id).HasColumnName("id");

            builder.Entity<Contrator>().Property(x => x.FirstName).HasColumnName("firstName").HasColumnType("VARCHAR(250)");
            builder.Entity<Contrator>().Property(x => x.LastName).HasColumnName("lastName").HasColumnType("VARCHAR(250)");
            builder.Entity<Contrator>().Property(x => x.Email).HasColumnName("email").HasColumnType("VARCHAR(250)");
            builder.Entity<Contrator>().Property(x => x.AccountId).HasColumnName("account_id");
            builder.Entity<Contrator>().Property(x => x.IsActive).HasColumnName("is_active").HasColumnType("bit");

            builder.Entity<DisbLineItem>()
                       .HasOne(x => x.Payee)
                       .WithMany(x => x.DisbLineItems)
                       .HasForeignKey(x => x.PayeeId)
                       .OnDelete(DeleteBehavior.NoAction);


            builder.Entity<PayeeSummary>()
                  .ToView("vwVendorSummary") // Name of your SQL view
                  .HasNoKey();
        }
    }
}