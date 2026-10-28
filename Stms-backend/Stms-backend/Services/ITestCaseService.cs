using Stms_backend.Dtos;

namespace Stms_backend.Services;

public interface ITestCaseService
{
    Task<List<TestCaseDto>?> GetBySuiteAsync(int suiteId);
    Task<TestCaseDto?> GetByIdAsync(int id);
    Task<TestCaseDto?> CreateAsync(int suiteId, CreateTestCaseDto dto);
    Task<bool> UpdateAsync(int id, UpdateTestCaseDto dto);
    Task<bool> DeleteAsync(int id);
}
