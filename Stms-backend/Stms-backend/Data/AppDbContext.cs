using Microsoft.EntityFrameworkCore;
using Stms_backend.Models;

namespace Stms_backend.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<TestSuite> TestSuites => Set<TestSuite>();
    public DbSet<TestCase> TestCases => Set<TestCase>();
    public DbSet<TestRun> TestRuns => Set<TestRun>();
    public DbSet<TestResult> TestResults => Set<TestResult>();
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<User>().Property(u => u.Role).HasConversion<string>();

        modelBuilder.Entity<TestCase>().Property(c => c.Priority).HasConversion<string>();

        modelBuilder.Entity<TestResult>().Property(r => r.Status).HasConversion<string>();
        modelBuilder.Entity<TestResult>().HasIndex(r => new { r.TestRunId, r.TestCaseId }).IsUnique();
        modelBuilder.Entity<TestResult>()
            .HasOne(r => r.ExecutedBy)
            .WithMany()
            .HasForeignKey(r => r.ExecutedById)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<TestRun>()
            .HasOne(r => r.CreatedBy)
            .WithMany()
            .HasForeignKey(r => r.CreatedById)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
