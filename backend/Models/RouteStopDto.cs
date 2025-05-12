public class RouteStopDto
{
    public int Id { get; set; }
    public string PortName { get; set; }
    public DateTime ArrivalTime { get; set; }
    public DateTime DepartureTime { get; set; }
    public int StopOrder { get; set; }
}