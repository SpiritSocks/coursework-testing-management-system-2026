using Stms_backend.Dtos;

namespace Stms_backend.Services;

public interface ITestSuiteService
{
    Task<List<TestSuiteDto>?> GetByProjectAsync(int projectId);
    Task<TestSuiteDto?> GetByIdAsync(int id);
    Task<TestSuiteDto?> CreateAsync(int projectId, CreateTestSuiteDto dto);
    Task<bool> UpdateAsync(int id, UpdateTestSuiteDto dto);
    Task<bool> DeleteAsync(int id);
}
