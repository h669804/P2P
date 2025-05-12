using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AppProject.Data;
using AppProject.Models;
using AppProject.Services;

[ApiController]
[Route("api/feedback")]
public class FeedbackController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly SusScoreService _susScoreService;

    public FeedbackController(AppDbContext context, SusScoreService susScoreService)
    {
        _context = context;
        _susScoreService = susScoreService;
    }

    [HttpPost("sus")]
    public async Task<IActionResult> SubmitSusFeedback([FromBody] SusFeedbackDto dto)
    {
        if (dto.Responses == null || dto.Responses.Count != 10)
            return BadRequest("Invalid input");

        double susScore = _susScoreService.CalculateSusScore(dto.Responses);

        // Optional: Save to DB
        var feedback = new SusFeedback
        {
            Responses = dto.Responses,
            SusScore = susScore,
            SubmittedAt = DateTime.UtcNow
        };

        _context.SusFeedbacks.Add(feedback);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Feedback received", susScore });
    }
}
