namespace Stms_backend.Models;

public class TestCase
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Preconditions { get; set; }
    public string Steps { get; set; } = string.Empty;
    public string ExpectedResult { get; set; } = string.Empty;
    public Priority Priority { get; set; } = Priority.Medium;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public int TestSuiteId { get; set; }
    public TestSuite TestSuite { get; set; } = null!;
    
}