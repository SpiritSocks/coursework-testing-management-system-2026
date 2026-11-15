using System.ComponentModel.DataAnnotations;
using Stms_backend.Models;

namespace Stms_backend.Dtos;

public class TestRunDto
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public string? CreatedByName { get; set; }
    public int TotalCount { get; set; }
    public int ExecutedCount { get; set; }
}

public class TestRunDetailsDto : TestRunDto
{
    public List<TestRunResultDto> Results { get; set; } = [];
}

public class TestRunResultDto
{
    public int Id { get; set; }
    public int TestCaseId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string SuiteName { get; set; } = string.Empty;
    public ResultStatus Status { get; set; }
    public string? Comment { get; set; }
}

public class CreateTestRunDto
{
    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;
}

public class UpdateTestResultDto
{
    public ResultStatus Status { get; set; }

    [MaxLength(2000)]
    public string? Comment { get; set; }
}
