using Microsoft.EntityFrameworkCore;
using Stms_backend.Data;
using Stms_backend.Dtos;
using Stms_backend.Models;

namespace Stms_backend.Services;

public class TestRunService(AppDbContext db) : ITestRunService
{
    public async Task<List<TestRunDto>?> GetByProjectAsync(int projectId)
    {
        if (!await db.Projects.AnyAsync(project => project.Id == projectId)) return null;

        return await db.TestRuns
            .Where(run => run.ProjectId == projectId)
            .OrderByDescending(run => run.StartedAt)
            .Select(run => new TestRunDto
            {
                Id = run.Id,
                ProjectId = run.ProjectId,
                Name = run.Name,
                StartedAt = run.StartedAt,
                CompletedAt = run.CompletedAt,
                CreatedByName = run.CreatedBy != null ? run.CreatedBy.FullName : null,
                TotalCount = run.Results.Count,
                ExecutedCount = run.Results.Count(result => result.Status != ResultStatus.Untested)
            })
            .ToListAsync();
    }

    public async Task<TestRunDetailsDto?> GetByIdAsync(int id)
    {
        return await db.TestRuns
            .Where(run => run.Id == id)
            .Select(run => new TestRunDetailsDto
            {
                Id = run.Id,
                ProjectId = run.ProjectId,
                Name = run.Name,
                StartedAt = run.StartedAt,
                CompletedAt = run.CompletedAt,
                CreatedByName = run.CreatedBy != null ? run.CreatedBy.FullName : null,
                TotalCount = run.Results.Count,
                ExecutedCount = run.Results.Count(result => result.Status != ResultStatus.Untested),
                Results = run.Results
                    .OrderBy(result => result.TestCaseId)
                    .Select(result => new TestRunResultDto
                    {
                        Id = result.Id,
                        TestCaseId = result.TestCaseId,
                        TestSuiteId = result.TestCase.TestSuiteId,
                        Title = result.TestCase.Title,
                        SuiteName = result.TestCase.TestSuite.Name,
                        Preconditions = result.TestCase.Preconditions,
                        Steps = result.TestCase.Steps,
                        ExpectedResult = result.TestCase.ExpectedResult,
                        Status = result.Status,
                        Comment = result.Comment
                    }).ToList()
            })
            .FirstOrDefaultAsync();
    }

    public async Task<TestRunDetailsDto?> CreateAsync(int projectId, CreateTestRunDto dto)
    {
        if (!await db.Projects.AnyAsync(project => project.Id == projectId)) return null;

        var caseIds = await db.TestCases
            .Where(testCase => testCase.TestSuite.ProjectId == projectId)
            .Select(testCase => testCase.Id)
            .ToListAsync();

        var run = new TestRun
        {
            ProjectId = projectId,
            Name = dto.Name.Trim(),
            Results = caseIds.Select(caseId => new TestResult { TestCaseId = caseId }).ToList()
        };
        db.TestRuns.Add(run);
        await db.SaveChangesAsync();
        return await GetByIdAsync(run.Id);
    }

    public async Task<bool> UpdateResultAsync(int resultId, UpdateTestResultDto dto)
    {
        var result = await db.TestResults.Include(item => item.TestRun)
            .FirstOrDefaultAsync(item => item.Id == resultId);
        if (result == null || result.TestRun.CompletedAt != null) return false;

        result.Status = dto.Status;
        result.Comment = string.IsNullOrWhiteSpace(dto.Comment) ? null : dto.Comment.Trim();
        result.ExecutedAt = dto.Status == ResultStatus.Untested ? null : DateTime.UtcNow;
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> CompleteAsync(int id)
    {
        var run = await db.TestRuns.FindAsync(id);
        if (run == null) return false;
        run.CompletedAt ??= DateTime.UtcNow;
        await db.SaveChangesAsync();
        return true;
    }
}
