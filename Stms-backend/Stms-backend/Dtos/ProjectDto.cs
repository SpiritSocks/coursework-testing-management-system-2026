namespace Stms_backend.Dtos;

using System.ComponentModel.DataAnnotations;

public class ProjectDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public int SuiteCount { get; set; }
    public int CaseCount { get; set; }
    public int RunCount { get; set; }
    public int LastRunPassed { get; set; }
    public int LastRunFailed { get; set; }
}

public class CreateProjectDto
{
    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string? Description { get; set; }
}

public class UpdateProjectDto
{
    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string? Description { get; set; }
}
