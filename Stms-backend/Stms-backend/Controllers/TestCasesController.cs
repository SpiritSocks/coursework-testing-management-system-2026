using Microsoft.AspNetCore.Mvc;
using Stms_backend.Dtos;
using Stms_backend.Services;

namespace Stms_backend.Controllers;

[ApiController]
public class TestCasesController : ControllerBase
{
    private readonly ITestCaseService _cases;

    public TestCasesController(ITestCaseService cases)
    {
        _cases = cases;
    }

    [HttpGet("api/suites/{suiteId:int}/cases")]
    public async Task<ActionResult<List<TestCaseDto>>> GetBySuite(int suiteId)
    {
        var cases = await _cases.GetBySuiteAsync(suiteId);
        if (cases == null)
        {
            return NotFound();
        }

        return Ok(cases);
    }

    [HttpGet("api/cases/{id:int}")]
    public async Task<ActionResult<TestCaseDto>> GetById(int id)
    {
        var testCase = await _cases.GetByIdAsync(id);
        if (testCase == null)
        {
            return NotFound();
        }

        return Ok(testCase);
    }

    [HttpPost("api/suites/{suiteId:int}/cases")]
    public async Task<ActionResult<TestCaseDto>> Create(int suiteId, CreateTestCaseDto dto)
    {
        var testCase = await _cases.CreateAsync(suiteId, dto);
        if (testCase == null)
        {
            return NotFound();
        }

        return CreatedAtAction(nameof(GetById), new { id = testCase.Id }, testCase);
    }

    [HttpPut("api/cases/{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateTestCaseDto dto)
    {
        var updated = await _cases.UpdateAsync(id, dto);
        if (!updated)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpDelete("api/cases/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _cases.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}
