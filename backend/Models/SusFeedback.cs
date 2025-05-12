using System;
using System.ComponentModel.DataAnnotations.Schema;

[Table("sus_feedback", Schema = "mobileapp")]
public class SusFeedback
{
    [Column("id")]
    public int Id { get; set; }
    [Column("responses")]
    public List<int> Responses { get; set; } = new();
    [Column("sus_score")]
    public double SusScore { get; set; }
    [Column("submitted_at")]
    public DateTime SubmittedAt { get; set; }
}
