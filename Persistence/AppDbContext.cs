using System;
using Domain;
using Microsoft.EntityFrameworkCore;
// using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Persistence
{
    public class AppDbContext(DbContextOptions options) : DbContext(options)
    {
        public required DbSet<Initiative> Initiatives { get; set; }
        public required DbSet<Category> Categories { get; set; }
        public required DbSet<Account> Accounts { get; set; }
        public required DbSet<Grant> Grants { get; set; }
        public required DbSet<BudgetLineItem> BudgetLineItems { get; set; }
        public required DbSet<BudgetComment> BudgetComments { get; set; }
        public required DbSet<Repro> Repros { get; set; }
        public required DbSet<ReproLineItem> ReproLineItems { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            var categories = new List<Category>
            {
                new() { Id = 1, Name = "Services" },
                new() { Id = 2, Name = "Facilities" },
                new() { Id = 3, Name = "Supplies" },
                new() { Id = 4, Name = "Personnel" },
                new() { Id = 5, Name = "Fringe" }
            };



            builder.Entity<Category>().HasData(categories);

            builder.Entity<Initiative>().HasData(
                new Initiative() { Id = 1, Name = "Management & Coordination" },
                new Initiative() { Id = 2, Name = "Training" },
                new Initiative() { Id = 3, Name = "ORS" },
                new Initiative() { Id = 4, Name = "Multimedia & Technology Unit" },
                new Initiative() { Id = 5, Name = "DHE" }
            );

            builder.Entity<Grant>().HasData(
                new Grant()
                {
                    Id = 1,
                    StartDate = new DateTime(2025, 1, 1),
                    EndDate = new DateTime(2026, 12, 31),
                    Name = "G25001",
                    Fiduciary = "MSCO"
                },
                new Grant()
                {
                    Id = 2,
                    StartDate = new DateTime(2025, 1, 1),
                    EndDate = new DateTime(2026, 12, 31),
                    Name = "G25002",
                    Fiduciary = "Cameron Co"
                },
                new Grant
                {
                    Id = 3,
                    StartDate = new DateTime(2026, 1, 1),
                    EndDate = new DateTime(2027, 12, 31),
                    Name = "G26001",
                    Fiduciary = "MCSO"
                },
                new Grant
                {
                    Id = 4,
                    StartDate = new DateTime(2026, 1, 1),
                    EndDate = new DateTime(2027, 12, 31),
                    Name = "G26002",
                    Fiduciary = "Cameron Co"
                }
            );


            builder.Entity<Account>().HasData(
                new Account()
                {
                    Id = 1,
                    Name = "Printing & Binding",
                    Number = "11-102-0312-54700",
                    CategoryId = 1,
                },
                new Account()
                {
                    Id = 2,
                    Name = "Insurance-Other",
                    Number = "11-102-0312-54701",
                    CategoryId = 1,
                },
                new Account()
                {
                    Id = 3,
                    Name = "Freight & Postage Service",
                    Number = "11-102-0312-54702",
                    CategoryId = 1,
                },
                new Account()
                {
                    Id = 4,
                    Name = "Communication Services",
                    Number = "11-102-0312-54703",
                    CategoryId = 1,
                },
                new Account()
                {
                    Id = 5,
                    Name = "Rentals & Lease",
                    Number = "11-102-0312-54704",
                    CategoryId = 2,
                },
                new Account()
                {
                    Id = 6,
                    Name = "Utilities - Electric",
                    Number = "11-102-0312-54705",
                    CategoryId = 2,
                },
                new Account()
                {
                    Id = 7,
                    Name = "Toner",
                    Number = "11-102-0312-54706",
                    CategoryId = 3,
                },
                new Account()
                {
                    Id = 8,
                    Name = "Pens",
                    Number = "11-102-0312-54707",
                    CategoryId = 3,
                },
                new Account()
                {
                    Id = 9,
                    Name = "Erasers",
                    Number = "11-102-0312-54708",
                    CategoryId = 3,
                }
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

            builder.Entity<BudgetLineItem>().HasData(
                new BudgetLineItem()
                {
                    AccountId = 1,
                    Amount = 100,
                    CreatedBy = 1,
                    CreateDate = new DateTime(2026, 7, 31, 8, 0, 0),
                    GrantId = 1,
                    InitiativeId = 1,
                    ItemType = "B",
                    Id = 1
                },
                new BudgetLineItem()
                {
                    AccountId = 3,
                    Amount = 100,
                    CreatedBy = 1,
                    CreateDate = new DateTime(2026, 7, 31, 8, 0, 0),
                    GrantId = 1,
                    InitiativeId = 1,
                    ItemType = "B",
                    Id = 2
                },
                new BudgetLineItem()
                {
                    AccountId = 4,
                    Amount = 105,
                    CreatedBy = 1,
                    CreateDate = new DateTime(2026, 7, 31, 8, 0, 0),
                    GrantId = 1,
                    InitiativeId = 1,
                    ItemType = "B",
                    Id = 3
                },
                new BudgetLineItem()
                {
                    AccountId = 7,
                    Amount = 1200,
                    CreatedBy = 1,
                    CreateDate = new DateTime(2026, 7, 31, 8, 0, 0),
                    GrantId = 1,
                    InitiativeId = 1,
                    ItemType = "B",
                    Id = 5
                },
                new BudgetLineItem()
                {
                    AccountId = 8,
                    Amount = 400,
                    CreatedBy = 1,
                    CreateDate = new DateTime(2026, 7, 31, 8, 0, 0),
                    GrantId = 1,
                    InitiativeId = 1,
                    ItemType = "B",
                    Id = 6
                },
                new BudgetLineItem()
                {
                    AccountId = 5,
                    Amount = 596.0M,
                    CreatedBy = 1,
                    CreateDate = new DateTime(2026, 7, 31, 8, 0, 0),
                    GrantId = 1,
                    InitiativeId = 1,
                    ItemType = "B",
                    Id = 7
                },
                new BudgetLineItem()
                {
                    AccountId = 8,
                    Amount = 400,
                    CreatedBy = 1,
                    CreateDate = new DateTime(2026, 7, 31, 8, 0, 0),
                    GrantId = 1,
                    InitiativeId = 2,
                    ItemType = "B",
                    Id = 9
                },
                new BudgetLineItem()
                {
                    AccountId = 5,
                    Amount = 750,
                    CreatedBy = 1,
                    CreateDate = new DateTime(2026, 7, 31, 8, 0, 0),
                    GrantId = 3,
                    InitiativeId = 1,
                    ItemType = "B",
                    Id = 10
                },
                new BudgetLineItem()
                {
                    AccountId = 8,
                    Amount = 250,
                    CreatedBy = 1,
                    CreateDate = new DateTime(2026, 7, 31, 8, 0, 0),
                    GrantId = 3,
                    InitiativeId = 2,
                    ItemType = "B",
                    Id = 11
                }

            );

            builder.Entity<Category>()
                .HasMany(x => x.Accounts)
                .WithOne(x => x.Category)
                .HasForeignKey(x => x.CategoryId);

            builder.Entity<AuthorizedUser>().Property(x => x.Id).HasColumnName("id");
            builder.Entity<AuthorizedUser>().Property(x => x.WindowsLogin).HasColumnName("windows_login").HasColumnType("varchar(50)");
            builder.Entity<AuthorizedUser>().Property(x => x.LastLoginDate).HasColumnName("last_login_date").HasColumnType("datetime");

            builder.Entity<Account>().Property(x => x.Id).HasColumnName("id");
            builder.Entity<Account>().Property(x => x.Number).HasColumnName("number").HasColumnType("varchar(50)");
            builder.Entity<Account>().Property(x => x.Name).HasColumnName("name").HasColumnType("varchar(500)"); ;
            builder.Entity<Account>().Property(x => x.CategoryId).HasColumnName("category_id");

            builder.Entity<Category>().Property(x => x.Id).HasColumnName("id");
            builder.Entity<Category>().Property(x => x.Name).HasColumnName("name").HasColumnType("varchar(50)"); ;

            builder.Entity<Initiative>().Property(x => x.Id).HasColumnName("id");
            builder.Entity<Initiative>().Property(x => x.Name).HasColumnName("name").HasColumnType("varchar(200)"); ;

            builder.Entity<Grant>().Property(x => x.Id).HasColumnName("id");
            builder.Entity<Grant>().Property(x => x.StartDate).HasColumnName("start_date");
            builder.Entity<Grant>().Property(x => x.EndDate).HasColumnName("end_date");
            builder.Entity<Grant>().Property(x => x.Fiduciary).HasColumnName("fiduciary");

            builder.Entity<Grant>().Property(x => x.Name).HasColumnName("name").HasColumnType("varchar(50)"); ;

            builder.Entity<BudgetLineItem>().Property(x => x.Amount).HasColumnName("amount");
            builder.Entity<BudgetLineItem>().Property(x => x.InitiativeId).HasColumnName("initiative_id");
            builder.Entity<BudgetLineItem>().Property(x => x.GrantId).HasColumnName("grant_id");
            builder.Entity<BudgetLineItem>().Property(x => x.AccountId).HasColumnName("account_id");
            builder.Entity<BudgetLineItem>().Property(x => x.ItemType).HasColumnName("item_type");
            builder.Entity<BudgetLineItem>().Property(x => x.CreateDate).HasColumnName("create_date").HasColumnType("DATETIME");
            builder.Entity<BudgetLineItem>().Property(x => x.CreatedBy).HasColumnName("created_by");
            builder.Entity<BudgetLineItem>().Property(x => x.UpdateDate).HasColumnName("update_date").HasColumnType("DATETIME");
            builder.Entity<BudgetLineItem>().Property(x => x.UpdatedBy).HasColumnName("updated_by");

            builder.Entity<BudgetComment>().Property(x => x.Text).HasColumnName("comment_text").HasColumnType("VARCHAR(MAX)"); ;
            builder.Entity<BudgetComment>().Property(x => x.EntryDate).HasColumnName("entry_date").HasColumnType("DATETIME").HasDefaultValueSql("GETDATE()");
            builder.Entity<BudgetComment>().Property(x => x.EntryPersonId).HasColumnName("entry_user_id");
            builder.Entity<BudgetComment>().Property(x => x.UpdateDate).HasColumnName("update_date").HasColumnType("DATETIME").HasDefaultValueSql("GETDATE()");
            builder.Entity<BudgetComment>().Property(x => x.UpdatePersonId).HasColumnName("update_user_id");

            builder.Entity<BudgetComment>().Property(x => x.InitiativeId).HasColumnName("initiative_id");
            builder.Entity<BudgetComment>().Property(x => x.GrantId).HasColumnName("grant_id");
            builder.Entity<BudgetComment>().Property(x => x.AccountId).HasColumnName("account_id");

            builder.Entity<Repro>().Property(x => x.Id).HasColumnName("id");
            builder.Entity<Repro>().Property(x => x.CreatedDate).HasColumnName("create_date").HasColumnType("DATETIME");
            builder.Entity<Repro>().Property(x => x.CreatedById).HasColumnName("created_by");
            builder.Entity<Repro>().Property(x => x.UpdateDate).HasColumnName("updated_date").HasColumnType("DATETIME");
            builder.Entity<Repro>().Property(x => x.UpdatedById).HasColumnName("updated_by");
            builder.Entity<Repro>().Property(x => x.Posted).HasColumnName("posted");
            builder.Entity<Repro>().Property(x => x.PostedById).HasColumnName("posted_by");
            builder.Entity<Repro>().Property(x => x.PostedDate).HasColumnName("posted_date").HasColumnType("DATETIME");
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
            builder.Entity<ReproLineItem>().Property(x => x.EntryDate).HasColumnName("entry_date").HasColumnType("DATETIME");
            builder.Entity<ReproLineItem>().Property(x => x.UpdatedById).HasColumnName("updated_by");
            builder.Entity<ReproLineItem>().Property(x => x.UpdateDate).HasColumnName("update_date").HasColumnType("DATETIME");
            builder.Entity<ReproLineItem>().Property(x => x.Comment).HasColumnName("comment").HasColumnType("VARCHAR(MAX)");
            builder.Entity<ReproLineItem>().Property(x => x.BudgetLineItemId).HasColumnName("budget_line_id");


            builder.Entity<ReproLineItem>()
                    .HasIndex(a => new { a.ReproId, a.InitiativeId, a.GrantId, a.CategoryId, a.AccountId })
                    .IsUnique();


        }
    }
}