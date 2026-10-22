using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataSeeder
    {
        public static void SeedData(ModelBuilder builder, string adminEmail)
        {

            var hasher = new PasswordHasher<ApplicationUser>();

            // Console.WriteLine(hasher.HashPassword(null, "Password#1"));

            var adminUser = new ApplicationUser
            {
                Id = 1, // HasData requires explicit IDs
                FirstName = "Hector",
                LastName = "Alfonso",
                UserName = "hialfonso",
                NormalizedEmail = adminEmail.ToUpper(),
                Email = adminEmail,
                ConcurrencyStamp = "b0c0b6fc-6995-44b7-ba34-ac6e8c33a9d3",
                SecurityStamp = "b0c0b6fc-6995-44b7-ba34-ac6e8c33a9d3",
                PasswordHash = "AQAAAAIAAYagAAAAEMretS6tJQofnGHE6J8YK9Nl9rrAKYe1lzklwWTDO5tyKZaolQg1ViAEkCVTg+Tl7g=="
            };


            // Pass the prepared data into HasData
            builder.Entity<ApplicationUser>().HasData(adminUser);





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
                new Initiative() { Id = 3, Name = "SOR" },
                new Initiative() { Id = 4, Name = "Multimedia & Technology Unit" },
                new Initiative() { Id = 5, Name = "HED" },
                new Initiative() { Id = 6, Name = "TAG" }
            );
            builder.Entity<Grant>().HasData(
                new Grant()
                {
                    Id = 1,
                    StartDate = new DateTime(2025, 1, 1),
                    EndDate = new DateTime(2026, 12, 31),
                    Name = "G25001",
                    Fiduciary = "COMS",
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
                new Category { Id = 1, Name = "Personnel", SortOrder = 1 },
                new Category { Id = 2, Name = "Facilities", SortOrder = 2 },
                new Category { Id = 3, Name = "Fringe", SortOrder = 3 },
                new Category { Id = 4, Name = "Equipment", SortOrder = 4 },
                new Category { Id = 5, Name = "Services Contractors", SortOrder = 5 },
                new Category { Id = 6, Name = "Services Vendors", SortOrder = 6 },
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

            //  25 - Services  - Freight and Postage Services
            builder.Entity<Payee>().HasData(
                new Payee() { Id = 1, Name = "Kinkos", AccountId = 13, IsActive = true, PayeeTypeId = PayeeType.Vendor },
                new Payee() { Id = 2, Name = "FedEx", AccountId = 13, IsActive = true, PayeeTypeId = PayeeType.Vendor },
                new Payee() { Id = 3, Name = "Shipstation", AccountId = 13, IsActive = true, PayeeTypeId = PayeeType.Vendor },
                new Payee() { Id = 4, Name = "Navis Pack & Ship", AccountId = 13, IsActive = true, PayeeTypeId = PayeeType.Vendor },
                new Payee() { Id = 5, Name = "ShippyPro", AccountId = 13, IsActive = true, PayeeTypeId = PayeeType.Vendor },
                new Payee() { Id = 6, Name = "Mimeo", AccountId = 13, IsActive = true, PayeeTypeId = PayeeType.Vendor },
                new Payee() { Id = 7, Name = "EasySip", AccountId = 13, IsActive = true, PayeeTypeId = PayeeType.Vendor },
                new Payee() { Id = 8, Name = "PackAndShip", AccountId = 13, IsActive = true, PayeeTypeId = PayeeType.Vendor }
            );

            //  26 -Services -  Communication Services
            builder.Entity<Payee>().HasData(
                new Payee() { Id = 9, Name = "AT & T", AccountId = 14, IsActive = true, PayeeTypeId = PayeeType.Vendor },
                new Payee() { Id = 10, Name = "Comcast", AccountId = 14, IsActive = true, PayeeTypeId = PayeeType.Vendor },
                new Payee() { Id = 11, Name = "Sunshine", AccountId = 14, IsActive = true, PayeeTypeId = PayeeType.Vendor },
                new Payee() { Id = 12, Name = "Motorola", AccountId = 14, IsActive = true, PayeeTypeId = PayeeType.Vendor },
                new Payee() { Id = 13, Name = "Voip Comm", AccountId = 14, IsActive = true, PayeeTypeId = PayeeType.Vendor },
                new Payee() { Id = 14, Name = "Tom Sanchez", AccountId = 19, IsActive = true, PayeeTypeId = PayeeType.Contractor },
                new Payee() { Id = 15, Name = "Marc Greenstien", AccountId = 19, IsActive = true, PayeeTypeId = PayeeType.Contractor },
                new Payee() { Id = 16, Name = "Troy Bankert", AccountId = 19, IsActive = true, PayeeTypeId = PayeeType.Contractor },
                new Payee() { Id = 17, Name = "Charles Bengston", AccountId = 19, IsActive = true, PayeeTypeId = PayeeType.Contractor },
                new Payee() { Id = 18, Name = "Ethan Steigerwald", AccountId = 19, IsActive = true, PayeeTypeId = PayeeType.Contractor },
                new Payee() { Id = 19, Name = "Steve Salas", AccountId = 19, IsActive = true, PayeeTypeId = PayeeType.Contractor },
                new Payee() { Id = 20, Name = "Tim Cardwell", AccountId = 19, IsActive = true, PayeeTypeId = PayeeType.Contractor },
                new Payee() { Id = 21, Name = "Tafoya Martina", AccountId = 19, IsActive = true, PayeeTypeId = PayeeType.Contractor },
                new Payee() { Id = 22, Name = "Jim Cormier", AccountId = 19, IsActive = true, PayeeTypeId = PayeeType.Contractor },
                new Payee() { Id = 23, Name = "Shaun Doyne", AccountId = 19, IsActive = true, PayeeTypeId = PayeeType.Contractor },
                new Payee() { Id = 24, Name = "John Eadie", AccountId = 19, IsActive = true, PayeeTypeId = PayeeType.Contractor },
                new Payee() { Id = 25, Name = "Orman Hall", AccountId = 19, IsActive = true, PayeeTypeId = PayeeType.Contractor },
                new Payee() { Id = 26, Name = "David Hamby", AccountId = 19, IsActive = true, PayeeTypeId = PayeeType.Contractor },
                new Payee() { Id = 27, Name = "Christopher Jakim", AccountId = 19, IsActive = true, PayeeTypeId = PayeeType.Contractor },
                new Payee() { Id = 28, Name = "Emma Kempton", AccountId = 19, IsActive = true, PayeeTypeId = PayeeType.Contractor },
                new Payee() { Id = 29, Name = "Rob Roggeveen", AccountId = 19, IsActive = true, PayeeTypeId = PayeeType.Contractor },
                new Payee() { Id = 31, Name = "Mike Snyders", AccountId = 19, IsActive = true, PayeeTypeId = PayeeType.Contractor }
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
                new BudgetItemType { ItemType = Globals.ITEM_TYPE_PAYMENT }
            );

            builder.Entity<BudgetHeader>().HasData(new BudgetHeader
            {
                InitiativeId = 1,
                GrantId = 1
            });

            builder.Entity<BudgetHeader>().HasData(new BudgetHeader
            {
                InitiativeId = 1,
                GrantId = 3
            });

            builder.Entity<BudgetHeader>().HasData(new BudgetHeader
            {
                InitiativeId = 2,
                GrantId = 1
            });
            builder.Entity<BudgetHeader>().HasData(new BudgetHeader
            {
                InitiativeId = 2,
                GrantId = 3
            });


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
               }

          );

        }
    }
}