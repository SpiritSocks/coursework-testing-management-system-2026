namespace Stms_backend.Models;

public class TestSuite
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;
    
    public List<TestCase> Cases { get; set; } = [];
}