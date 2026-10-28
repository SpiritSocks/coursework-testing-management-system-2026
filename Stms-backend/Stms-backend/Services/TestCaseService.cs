using Microsoft.EntityFrameworkCore;
using Stms_backend.Data;
using Stms_backend.Dtos;
using Stms_backend.Models;

namespace Stms_backend.Services;

public class TestCaseService : ITestCaseService
{
    private readonly AppDbContext _db;

    public TestCaseService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<TestCaseDto>?> GetBySuiteAsync(int suiteId)
    {
        var suiteExists = await _db.TestSuites.AnyAsync(s => s.Id == suiteId);
        if (!suiteExists)
        {
            return null;
        }

        return await _db.TestCases
            .Where(c => c.TestSuiteId == suiteId)
            .OrderBy(c => c.Id)
            .Select(c => new TestCaseDto
            {
                Id = c.Id,
                TestSuiteId = c.TestSuiteId,
                Title = c.Title,
                Preconditions = c.Preconditions,
                Steps = c.Steps,
                ExpectedResult = c.ExpectedResult,
                Priority = c.Priority,
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<TestCaseDto?> GetByIdAsync(int id)
    {
        return await _db.TestCases
            .Where(c => c.Id == id)
            .Select(c => new TestCaseDto
            {
                Id = c.Id,
                TestSuiteId = c.TestSuiteId,
                Title = c.Title,
                Preconditions = c.Preconditions,
                Steps = c.Steps,
                ExpectedResult = c.ExpectedResult,
                Priority = c.Priority,
                CreatedAt = c.CreatedAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task<TestCaseDto?> CreateAsync(int suiteId, CreateTestCaseDto dto)
    {
        var suiteExists = await _db.TestSuites.AnyAsync(s => s.Id == suiteId);
        if (!suiteExists)
        {
            return null;
        }

        var testCase = new TestCase
        {
            TestSuiteId = suiteId,
            Title = dto.Title,
            Preconditions = dto.Preconditions,
            Steps = dto.Steps,
            ExpectedResult = dto.ExpectedResult,
            Priority = dto.Priority
        };

        _db.TestCases.Add(testCase);
        await _db.SaveChangesAsync();

        return new TestCaseDto
        {
            Id = testCase.Id,
            TestSuiteId = testCase.TestSuiteId,
            Title = testCase.Title,
            Preconditions = testCase.Preconditions,
            Steps = testCase.Steps,
            ExpectedResult = testCase.ExpectedResult,
            Priority = testCase.Priority,
            CreatedAt = testCase.CreatedAt
        };
    }

    public async Task<bool> UpdateAsync(int id, UpdateTestCaseDto dto)
    {
        var testCase = await _db.TestCases.FindAsync(id);
        if (testCase == null)
        {
            return false;
        }

        testCase.Title = dto.Title;
        testCase.Preconditions = dto.Preconditions;
        testCase.Steps = dto.Steps;
        testCase.ExpectedResult = dto.ExpectedResult;
        testCase.Priority = dto.Priority;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var testCase = await _db.TestCases.FindAsync(id);
        if (testCase == null)
        {
            return false;
        }

        _db.TestCases.Remove(testCase);
        await _db.SaveChangesAsync();
        return true;
    }
}
