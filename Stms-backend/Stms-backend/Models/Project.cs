namespace Stms_backend.Models;

public class Project
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<TestSuite> Suites { get; set; } = [];
    public List<TestRun> Runs { get; set; } = [];
    
}