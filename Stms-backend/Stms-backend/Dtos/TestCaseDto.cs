using System.ComponentModel.DataAnnotations;
using Stms_backend.Models;

namespace Stms_backend.Dtos;

public class TestCaseDto
{
    public int Id { get; set; }
    public int TestSuiteId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Preconditions { get; set; }
    public string Steps { get; set; } = string.Empty;
    public string ExpectedResult { get; set; } = string.Empty;
    public Priority Priority { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateTestCaseDto
{
    [Required, MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string? Preconditions { get; set; }

    [Required]
    public string Steps { get; set; } = string.Empty;

    [Required]
    public string ExpectedResult { get; set; } = string.Empty;

    public Priority Priority { get; set; } = Priority.Medium;
}

public class UpdateTestCaseDto
{
    [Required, MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string? Preconditions { get; set; }

    [Required]
    public string Steps { get; set; } = string.Empty;

    [Required]
    public string ExpectedResult { get; set; } = string.Empty;

    public Priority Priority { get; set; } = Priority.Medium;
}
