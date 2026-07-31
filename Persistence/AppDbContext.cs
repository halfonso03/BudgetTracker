using System;
using Domain;
using Microsoft.EntityFrameworkCore;
// using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Persistence
{
    public class AppDbContext : DbContext
    {
        public required DbSet<Initiative> Initiatives { get; set; }
        public required DbSet<Category> Categories { get; set; }
        public required DbSet<Account> Accounts { get; set; }
        public required DbSet<Grant> Grants { get; set; }

        public required DbSet<BudgetLineItem> BudgetLineItems { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
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
            builder.Entity<Grant>().Property(x => x.Name).HasColumnName("name").HasColumnType("varchar(50)"); ;


            builder.Entity<BudgetLineItem>().Property(x => x.Amount).HasColumnName("amount");
            builder.Entity<BudgetLineItem>().Property(x => x.InitiativeId).HasColumnName("initiative_id");
            builder.Entity<BudgetLineItem>().Property(x => x.GrantId).HasColumnName("grant_id");
            builder.Entity<BudgetLineItem>().Property(x => x.AccountId).HasColumnName("account_id");
            builder.Entity<BudgetLineItem>().Property(x => x.CreateDate).HasColumnName("create_date").HasColumnType("datetime");
            builder.Entity<BudgetLineItem>().Property(x => x.CreatedBy).HasColumnName("created_by");
            builder.Entity<BudgetLineItem>().Property(x => x.UpdateDate).HasColumnName("update_date").HasColumnType("datetime");
            builder.Entity<BudgetLineItem>().Property(x => x.UpdatedBy).HasColumnName("updated_by");






        }

    }
}