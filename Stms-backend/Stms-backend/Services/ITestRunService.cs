using Stms_backend.Dtos;

namespace Stms_backend.Services;

public interface ITestRunService
{
    Task<List<TestRunDto>?> GetByProjectAsync(int projectId);
    Task<TestRunDetailsDto?> GetByIdAsync(int id);
    Task<TestRunDetailsDto?> CreateAsync(int projectId, CreateTestRunDto dto);
    Task<bool> UpdateResultAsync(int resultId, UpdateTestResultDto dto);
    Task<bool> CompleteAsync(int id);
}
