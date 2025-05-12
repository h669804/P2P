namespace AppProject.Models
{
    public class RouteStop
    {
        public int Id { get; set; }
        public int RouteId { get; set; }
        public VoyageRoute Route { get; set; }
        public string PortName { get; set; }
        public DateTime ArrivalTime { get; set; }
        public DateTime DepartureTime { get; set; }
        public int StopOrder { get; set; }
    }
}