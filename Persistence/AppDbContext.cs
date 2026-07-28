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

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Category>()
                .HasMany(x => x.Accounts)
                .WithOne(x => x.Category)
                .HasForeignKey(x => x.CategoryId);
            
        }
        
    }
}