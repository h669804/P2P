using System.ComponentModel.DataAnnotations.Schema;

namespace AppProject.Models
{
    [Table("VoyageRoutes")]
    public class VoyageRoute
    {
        public int Id { get; set; }
        public string DeparturePort { get; set; }
        public string ArrivalPort { get; set; }
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }
        public string ShipName { get; set; }
        public decimal Price { get; set; }
        public int AvailableSeats { get; set; }
        public bool IsActive { get; set; }
        public string RouteCode { get; set; }
        public string Description { get; set; }
        public List<RouteStop> Stops { get; set; }
    }
}