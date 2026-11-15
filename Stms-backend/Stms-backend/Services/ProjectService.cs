using Microsoft.EntityFrameworkCore;
using Stms_backend.Data;
using Stms_backend.Dtos;
using Stms_backend.Models;

namespace Stms_backend.Services;

public class ProjectService : IProjectService
{
    private readonly AppDbContext _db;

    public ProjectService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<ProjectDto>> GetAllAsync()
    {
        return await _db.Projects
            .OrderBy(p => p.Id)
            .Select(p => new ProjectDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                CreatedAt = p.CreatedAt,
                SuiteCount = p.Suites.Count,
                CaseCount = p.Suites.SelectMany(suite => suite.Cases).Count(),
                RunCount = p.Runs.Count,
                LastRunPassed = p.Runs
                    .OrderByDescending(run => run.StartedAt)
                    .Select(run => run.Results.Count == 0
                        ? 0
                        : run.Results.Count(result => result.Status == ResultStatus.Passed) * 100 / run.Results.Count)
                    .FirstOrDefault(),
                LastRunFailed = p.Runs
                    .OrderByDescending(run => run.StartedAt)
                    .Select(run => run.Results.Count == 0
                        ? 0
                        : run.Results.Count(result => result.Status == ResultStatus.Failed) * 100 / run.Results.Count)
                    .FirstOrDefault()
            })
            .ToListAsync();
    }

    public async Task<ProjectDto?> GetByIdAsync(int id)
    {
        return await _db.Projects
            .Where(p => p.Id == id)
            .Select(p => new ProjectDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                CreatedAt = p.CreatedAt,
                SuiteCount = p.Suites.Count,
                CaseCount = p.Suites.SelectMany(suite => suite.Cases).Count(),
                RunCount = p.Runs.Count,
                LastRunPassed = p.Runs
                    .OrderByDescending(run => run.StartedAt)
                    .Select(run => run.Results.Count == 0
                        ? 0
                        : run.Results.Count(result => result.Status == ResultStatus.Passed) * 100 / run.Results.Count)
                    .FirstOrDefault(),
                LastRunFailed = p.Runs
                    .OrderByDescending(run => run.StartedAt)
                    .Select(run => run.Results.Count == 0
                        ? 0
                        : run.Results.Count(result => result.Status == ResultStatus.Failed) * 100 / run.Results.Count)
                    .FirstOrDefault()
            })
            .FirstOrDefaultAsync();
    }

    public async Task<ProjectDto> CreateAsync(CreateProjectDto dto)
    {
        var project = new Project
        {
            Name = dto.Name,
            Description = dto.Description
        };

        _db.Projects.Add(project);
        await _db.SaveChangesAsync();

        return new ProjectDto
        {
            Id = project.Id,
            Name = project.Name,
            Description = project.Description,
            CreatedAt = project.CreatedAt
        };
    }

    public async Task<bool> UpdateAsync(int id, UpdateProjectDto dto)
    {
        var project = await _db.Projects.FindAsync(id);
        if (project == null)
        {
            return false;
        }

        project.Name = dto.Name;
        project.Description = dto.Description;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var project = await _db.Projects.FindAsync(id);
        if (project == null)
        {
            return false;
        }

        _db.Projects.Remove(project);
        await _db.SaveChangesAsync();
        return true;
    }
}
