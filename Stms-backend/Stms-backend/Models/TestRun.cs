namespace Stms_backend.Models;

public class TestRun
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }

    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;

    public int CreatedById { get; set; }
    public User CreatedBy { get; set; } = null!;

    public List<TestResult> Results { get; set; } = [];
}
