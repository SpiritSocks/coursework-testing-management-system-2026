using Microsoft.EntityFrameworkCore;
using Stms_backend.Data;
using Stms_backend.Dtos;
using Stms_backend.Models;

namespace Stms_backend.Services;

public class TestSuiteService : ITestSuiteService
{
    private readonly AppDbContext _db;

    public TestSuiteService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<TestSuiteDto>?> GetByProjectAsync(int projectId)
    {
        var projectExists = await _db.Projects.AnyAsync(p => p.Id == projectId);
        if (!projectExists)
        {
            return null;
        }

        return await _db.TestSuites
            .Where(s => s.ProjectId == projectId)
            .OrderBy(s => s.Id)
            .Select(s => new TestSuiteDto
            {
                Id = s.Id,
                ProjectId = s.ProjectId,
                Name = s.Name,
                Description = s.Description,
                CaseCount = s.Cases.Count,
                CreatedAt = s.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<TestSuiteDto?> GetByIdAsync(int id)
    {
        return await _db.TestSuites
            .Where(s => s.Id == id)
            .Select(s => new TestSuiteDto
            {
                Id = s.Id,
                ProjectId = s.ProjectId,
                Name = s.Name,
                Description = s.Description,
                CaseCount = s.Cases.Count,
                CreatedAt = s.CreatedAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task<TestSuiteDto?> CreateAsync(int projectId, CreateTestSuiteDto dto)
    {
        var projectExists = await _db.Projects.AnyAsync(p => p.Id == projectId);
        if (!projectExists)
        {
            return null;
        }

        var suite = new TestSuite
        {
            ProjectId = projectId,
            Name = dto.Name,
            Description = dto.Description
        };

        _db.TestSuites.Add(suite);
        await _db.SaveChangesAsync();

        return new TestSuiteDto
        {
            Id = suite.Id,
            ProjectId = suite.ProjectId,
            Name = suite.Name,
            Description = suite.Description,
            CaseCount = 0,
            CreatedAt = suite.CreatedAt
        };
    }

    public async Task<bool> UpdateAsync(int id, UpdateTestSuiteDto dto)
    {
        var suite = await _db.TestSuites.FindAsync(id);
        if (suite == null)
        {
            return false;
        }

        suite.Name = dto.Name;
        suite.Description = dto.Description;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var suite = await _db.TestSuites.FindAsync(id);
        if (suite == null)
        {
            return false;
        }

        _db.TestSuites.Remove(suite);
        await _db.SaveChangesAsync();
        return true;
    }
}
