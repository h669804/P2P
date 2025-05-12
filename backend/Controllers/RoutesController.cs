using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AppProject.Data;
using AppProject.Models;
using System.Linq;

namespace AppProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoutesController : ControllerBase
    {
        private readonly RoutesDbContext _context;

        public RoutesController(RoutesDbContext context)
        {
            _context = context;
        }


        /// <summary>
        /// Returnerer alle rutene i systemet.
        /// </summary>
        /// <returns>En liste med ruteobjekter.</returns>

        [HttpGet]
        public async Task<ActionResult<IEnumerable<VoyageRouteDto>>> GetRoutes()
        {
            var routes = await _context.Routes
                .Include(r => r.Stops)
                .Select(r => new VoyageRouteDto
                {
                    Id = r.Id,
                    DeparturePort = r.DeparturePort,
                    ArrivalPort = r.ArrivalPort,
                    DepartureTime = r.DepartureTime,
                    ArrivalTime = r.ArrivalTime,
                    ShipName = r.ShipName,
                    Price = r.Price,
                    AvailableSeats = r.AvailableSeats,
                    IsActive = r.IsActive,
                    RouteCode = r.RouteCode,
                    Description = r.Description,
                    Stops = r.Stops.Select(s => new RouteStopDto
                    {
                        Id = s.Id,
                        PortName = s.PortName,
                        ArrivalTime = s.ArrivalTime,
                        DepartureTime = s.DepartureTime,
                        StopOrder = s.StopOrder
                    }).ToList()
                })
                .ToListAsync();

            return routes;
        }


        /// <summary>
        /// Returnerer en spesifikk rute basert på ID.
        /// </summary>
        /// <param name="id">ID-en til ruten.</param>
        /// <returns>Ruteobjektet.</returns>

        [HttpGet("{id}")]
        public async Task<ActionResult<VoyageRouteDto>> GetRoute(int id)
        {
            var route = await _context.Routes
                .Include(r => r.Stops)
                .Where(r => r.Id == id)
                .Select(r => new VoyageRouteDto
                {
                    Id = r.Id,
                    DeparturePort = r.DeparturePort,
                    ArrivalPort = r.ArrivalPort,
                    DepartureTime = r.DepartureTime,
                    ArrivalTime = r.ArrivalTime,
                    ShipName = r.ShipName,
                    Price = r.Price,
                    AvailableSeats = r.AvailableSeats,
                    IsActive = r.IsActive,
                    RouteCode = r.RouteCode,
                    Description = r.Description,
                    Stops = r.Stops.Select(s => new RouteStopDto
                    {
                        Id = s.Id,
                        PortName = s.PortName,
                        ArrivalTime = s.ArrivalTime,
                        DepartureTime = s.DepartureTime,
                        StopOrder = s.StopOrder
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (route == null)
            {
                return NotFound();
            }

            return route;
        }

        /// <summary>
        /// Søker etter ruter basert på avgangs- og ankomsthavn.
        /// </summary>
        /// <param name="departure">Navnet på avgangshavnen.</param>
        /// <param name="arrival">Navnet på ankomsthavnen.</param>
        /// <param name="date">Reisedato (valgfritt).</param>
        /// <returns>En liste over ruter som samsvarer med søket.</returns>

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<VoyageRouteDto>>> SearchRoutesByPorts(string departure, string arrival, DateTime? date = null)
        {
            if (string.IsNullOrEmpty(departure) || string.IsNullOrEmpty(arrival))
            {
                return BadRequest("Both departure and arrival port names are required");
            }

            // If no date is provided, use the current date and time
            DateTime searchDate = date ?? DateTime.Now;

            Console.WriteLine($"Searching for routes from {departure} to {arrival}");

            // Get all routes and their stops
            var allRoutes = await _context.Routes
                .Include(r => r.Stops)
                .ToListAsync();

            // List to store matches
            var matchingRoutes = new List<VoyageRouteDto>();

            foreach (var route in allRoutes)
            {
                // Collect all ports on this route (including main ports and stops)
                var portsOnRoute = new List<PortInfo>
                {
                    // Add main departure port
                    new PortInfo
                    {
                        Name = route.DeparturePort,
                        ArrivalTime = route.DepartureTime,
                        DepartureTime = route.DepartureTime,
                        Order = 0
                    }
                };

                // Add intermediate stops
                portsOnRoute.AddRange(route.Stops
                    .OrderBy(s => s.StopOrder)
                    .Select(stop => new PortInfo
                    {
                        Name = stop.PortName,
                        ArrivalTime = stop.ArrivalTime,
                        DepartureTime = stop.DepartureTime,
                        Order = stop.StopOrder
                    }));

                // Add main arrival port
                portsOnRoute.Add(new PortInfo
                {
                    Name = route.ArrivalPort,
                    ArrivalTime = route.ArrivalTime,
                    DepartureTime = route.ArrivalTime,
                    Order = portsOnRoute.Count
                });

                // Find all matching departure and arrival ports
                var departureMatches = portsOnRoute
                    .Where(p => IsPortMatch(p.Name, departure))
                    .ToList();

                var arrivalMatches = portsOnRoute
                    .Where(p => IsPortMatch(p.Name, arrival))
                    .ToList();

                // Check each departure and arrival combination
                foreach (var depPort in departureMatches)
                {
                    foreach (var arrPort in arrivalMatches)
                    {
                        // Ensure departure comes before arrival
                        if (depPort.Order < arrPort.Order)
                        {
                            var routeDto = new VoyageRouteDto
                            {
                                Id = route.Id,
                                DeparturePort = depPort.Name,
                                ArrivalPort = arrPort.Name,
                                DepartureTime = depPort.DepartureTime,
                                ArrivalTime = arrPort.ArrivalTime,
                                ShipName = route.ShipName,
                                // Calculate proportional price
                                Price = Math.Max(1000, CalculateSegmentPrice(
                                    route.Price,
                                    route.DepartureTime,
                                    route.ArrivalTime,
                                    depPort.DepartureTime,
                                    arrPort.ArrivalTime)),
                                AvailableSeats = route.AvailableSeats,
                                IsActive = route.IsActive,
                                RouteCode = route.RouteCode,
                                Description = $"Route from {depPort.Name} to {arrPort.Name} on {route.ShipName}",
                                Stops = route.Stops
                                    .Where(s => s.StopOrder > depPort.Order && s.StopOrder < arrPort.Order)
                                    .OrderBy(s => s.StopOrder)
                                    .Select(s => new RouteStopDto
                                    {
                                        Id = s.Id,
                                        PortName = s.PortName,
                                        ArrivalTime = s.ArrivalTime,
                                        DepartureTime = s.DepartureTime,
                                        StopOrder = s.StopOrder - depPort.Order
                                    })
                                    .ToList()
                            };

                            matchingRoutes.Add(routeDto);
                        }
                    }
                }
            }

            Console.WriteLine($"Found {matchingRoutes.Count} matching routes");

            // Sort by how close the departure date is to the requested date
            var sortedRoutes = matchingRoutes
                .OrderBy(r => Math.Abs((r.DepartureTime - searchDate).TotalHours))
                .Take(4)
                .ToList();

            return sortedRoutes;
        }

        /// <summary>
        /// Hjelpemetode for å sjekke om to havnenavn samsvarer.
        /// </summary>
        /// <param name="routePort">Havnenavnet fra ruten.</param>
        /// <param name="searchPort">Havnenavnet det søkes etter.</param>
        /// <returns>True hvis de samsvarer, ellers false.</returns>

        private bool IsPortMatch(string routePort, string searchPort)
        {
            // Normalize ports by removing diacritics and converting to lowercase
            string normRoutePort = NormalizePort(routePort);
            string normSearchPort = NormalizePort(searchPort);

            // Exact match
            if (normRoutePort == normSearchPort) return true;

            // Partial match
            if (normRoutePort.Contains(normSearchPort) || normSearchPort.Contains(normRoutePort)) return true;

            return false;
        }


        /// <summary>
        /// Normaliserer havnenavn ved å fjerne diakritiske tegn og konvertere til små bokstaver.
        /// </summary>
        /// <param name="port">Havnenavnet som skal normaliseres.</param>
        /// <returns>Det normaliserte havnenavnet.</returns>

        private string NormalizePort(string port)
        {
            return port.Trim().ToLowerInvariant()
                .Replace("ø", "o")
                .Replace("æ", "ae")
                .Replace("å", "a");
        }


        /// <summary>
        /// Hjelpeklasse for å lagre informasjon om havner.
        /// </summary> 
        private class PortInfo
        {
            public string Name { get; set; }
            public DateTime ArrivalTime { get; set; }
            public DateTime DepartureTime { get; set; }
            public int Order { get; set; }
        }


        /// <summary>
        /// Beregner prisen for en del av ruten basert på varigheten.
        /// </summary>
        /// <param name="fullRoutePrice">Totalprisen for hele ruten.</param>
        /// <param name="routeStart">Starttidspunktet for hele ruten.</param>
        /// <param name="routeEnd">Sluttidspunktet for hele ruten.</param>
        /// <param name="segmentStart">Starttidspunktet for delruten.</param>
        /// <param name="segmentEnd">Sluttidspunktet for delruten.</param>
        /// <returns>Den beregnede prisen for delruten.</returns>

        private decimal CalculateSegmentPrice(decimal fullRoutePrice, DateTime routeStart, DateTime routeEnd,
                                            DateTime segmentStart, DateTime segmentEnd)
        {
            double fullRouteDurationHours = (routeEnd - routeStart).TotalHours;
            double segmentDurationHours = (segmentEnd - segmentStart).TotalHours;

            // Handle edge cases
            if (fullRouteDurationHours <= 0 || segmentDurationHours <= 0)
            {
                return 1000; // Minimum price
            }

            decimal segmentPrice = fullRoutePrice * (decimal)(segmentDurationHours / fullRouteDurationHours);
            return Math.Max(1000, segmentPrice);
        }
    }
}