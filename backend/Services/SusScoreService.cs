namespace AppProject.Services;
public class SusScoreService
{
    public double CalculateSusScore(List<int> responses)
    {
    if (responses == null || responses.Count != 10)
        throw new ArgumentException("Invalid number of responses");

    double total = 0;
    for (int i = 0; i < responses.Count; i++)
    {
        int score = (i % 2 == 0) ? responses[i] - 1 : 5 - responses[i];
        total += score;
    }
    return total * 2.5;
    }
}