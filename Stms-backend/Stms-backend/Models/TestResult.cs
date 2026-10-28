namespace Stms_backend.Models;

public class TestResult
{
    public int Id { get; set; }
    public ResultStatus Status { get; set; } = ResultStatus.Untested;
    public string? Comment { get; set; }
    public DateTime? ExecutedAt { get; set; }

    public int TestRunId { get; set; }
    public TestRun TestRun { get; set; } = null!;

    public int TestCaseId { get; set; }
    public TestCase TestCase { get; set; } = null!;

    public int? ExecutedById { get; set; }
    public User? ExecutedBy { get; set; }
}
