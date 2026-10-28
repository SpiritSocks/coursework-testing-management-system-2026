using Microsoft.AspNetCore.Mvc;
using Stms_backend.Dtos;
using Stms_backend.Services;

namespace Stms_backend.Controllers;

[ApiController]
public class TestSuitesController : ControllerBase
{
    private readonly ITestSuiteService _suites;

    public TestSuitesController(ITestSuiteService suites)
    {
        _suites = suites;
    }

    [HttpGet("api/projects/{projectId:int}/suites")]
    public async Task<ActionResult<List<TestSuiteDto>>> GetByProject(int projectId)
    {
        var suites = await _suites.GetByProjectAsync(projectId);
        if (suites == null)
        {
            return NotFound();
        }

        return Ok(suites);
    }

    [HttpGet("api/suites/{id:int}")]
    public async Task<ActionResult<TestSuiteDto>> GetById(int id)
    {
        var suite = await _suites.GetByIdAsync(id);
        if (suite == null)
        {
            return NotFound();
        }

        return Ok(suite);
    }

    [HttpPost("api/projects/{projectId:int}/suites")]
    public async Task<ActionResult<TestSuiteDto>> Create(int projectId, CreateTestSuiteDto dto)
    {
        var suite = await _suites.CreateAsync(projectId, dto);
        if (suite == null)
        {
            return NotFound();
        }

        return CreatedAtAction(nameof(GetById), new { id = suite.Id }, suite);
    }

    [HttpPut("api/suites/{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateTestSuiteDto dto)
    {
        var updated = await _suites.UpdateAsync(id, dto);
        if (!updated)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpDelete("api/suites/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _suites.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}
