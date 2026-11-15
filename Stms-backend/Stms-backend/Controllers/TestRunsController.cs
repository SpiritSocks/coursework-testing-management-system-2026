using Microsoft.AspNetCore.Mvc;
using Stms_backend.Dtos;
using Stms_backend.Services;

namespace Stms_backend.Controllers;

[ApiController]
public class TestRunsController(ITestRunService runs) : ControllerBase
{
    [HttpGet("api/projects/{projectId:int}/runs")]
    public async Task<ActionResult<List<TestRunDto>>> GetByProject(int projectId)
    {
        var result = await runs.GetByProjectAsync(projectId);
        return result == null ? NotFound() : Ok(result);
    }

    [HttpGet("api/runs/{id:int}")]
    public async Task<ActionResult<TestRunDetailsDto>> GetById(int id)
    {
        var result = await runs.GetByIdAsync(id);
        return result == null ? NotFound() : Ok(result);
    }

    [HttpPost("api/projects/{projectId:int}/runs")]
    public async Task<ActionResult<TestRunDetailsDto>> Create(int projectId, CreateTestRunDto dto)
    {
        var result = await runs.CreateAsync(projectId, dto);
        return result == null ? NotFound() : CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("api/results/{id:int}")]
    public async Task<IActionResult> UpdateResult(int id, UpdateTestResultDto dto)
    {
        return await runs.UpdateResultAsync(id, dto) ? NoContent() : NotFound();
    }

    [HttpPost("api/runs/{id:int}/complete")]
    public async Task<IActionResult> Complete(int id)
    {
        return await runs.CompleteAsync(id) ? NoContent() : NotFound();
    }
}
