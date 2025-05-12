using AppProject.Models;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace AppProject.Data
{
    public static class RouteSeeder
    {
        // Northbound routes
        private static readonly List<(string port, TimeSpan arrivalTime, TimeSpan departureTime)> BergenToTrondheimNorthbound = new()
        {
            ("Bergen", TimeSpan.Parse("14:45"), TimeSpan.Parse("20:30")),
            ("Florø", TimeSpan.Parse("02:45"), TimeSpan.Parse("03:00")),
            ("Måløy", TimeSpan.Parse("05:15"), TimeSpan.Parse("05:30")),
            ("Torvik", TimeSpan.Parse("08:20"), TimeSpan.Parse("08:30")),
            ("Ålesund", TimeSpan.Parse("09:45"), TimeSpan.Parse("20:00")),
            ("Molde", TimeSpan.Parse("22:35"), TimeSpan.Parse("23:05")),
            ("Kristiansund", TimeSpan.Parse("02:45"), TimeSpan.Parse("03:00")),
            ("Trondheim", TimeSpan.Parse("09:45"), TimeSpan.Parse("12:45"))
        };

        private static readonly List<(string port, TimeSpan arrivalTime, TimeSpan departureTime)> TrondheimToTromsøNorthbound = new()
        {
            ("Trondheim", TimeSpan.Parse("09:45"), TimeSpan.Parse("12:45")),
            ("Rørvik", TimeSpan.Parse("21:40"), TimeSpan.Parse("22:00")),
            ("Brønnøysund", TimeSpan.Parse("01:35"), TimeSpan.Parse("01:45")),
            ("Sandnessjøen", TimeSpan.Parse("04:35"), TimeSpan.Parse("04:50")),
            ("Nesna", TimeSpan.Parse("06:00"), TimeSpan.Parse("06:10")),
            ("Ørnes", TimeSpan.Parse("10:00"), TimeSpan.Parse("10:10")),
            ("Bodø", TimeSpan.Parse("13:05"), TimeSpan.Parse("15:20")),
            ("Stamsund", TimeSpan.Parse("19:15"), TimeSpan.Parse("19:40")),
            ("Svolvær", TimeSpan.Parse("21:20"), TimeSpan.Parse("22:15")),
            ("Stokmarknes", TimeSpan.Parse("01:30"), TimeSpan.Parse("01:40")),
            ("Sortland", TimeSpan.Parse("02:55"), TimeSpan.Parse("03:10")),
            ("Risøyhamn", TimeSpan.Parse("04:35"), TimeSpan.Parse("04:50")),
            ("Harstad", TimeSpan.Parse("07:10"), TimeSpan.Parse("07:45")),
            ("Finnsnes", TimeSpan.Parse("11:00"), TimeSpan.Parse("11:30")),
            ("Tromsø", TimeSpan.Parse("14:15"), TimeSpan.Parse("18:15"))
        };

        private static readonly List<(string port, TimeSpan arrivalTime, TimeSpan departureTime)> TromsøToKirkenesNorthbound = new()
        {
            ("Tromsø", TimeSpan.Parse("14:15"), TimeSpan.Parse("18:15")),
            ("Skjervøy", TimeSpan.Parse("22:10"), TimeSpan.Parse("22:25")),
            ("Øksfjord", TimeSpan.Parse("01:50"), TimeSpan.Parse("02:00")),
            ("Hammerfest", TimeSpan.Parse("05:05"), TimeSpan.Parse("05:45")),
            ("Havøysund", TimeSpan.Parse("08:30"), TimeSpan.Parse("08:45")),
            ("Honningsvåg", TimeSpan.Parse("10:55"), TimeSpan.Parse("14:30")),
            ("Kjøllefjord", TimeSpan.Parse("16:40"), TimeSpan.Parse("17:00")),
            ("Mehamn", TimeSpan.Parse("18:55"), TimeSpan.Parse("19:15")),
            ("Berlevåg", TimeSpan.Parse("22:00"), TimeSpan.Parse("22:10")),
            ("Båtsfjord", TimeSpan.Parse("00:00"), TimeSpan.Parse("00:30")),
            ("Vardø", TimeSpan.Parse("03:30"), TimeSpan.Parse("03:45")),
            ("Vadsø", TimeSpan.Parse("06:55"), TimeSpan.Parse("07:15")),
            ("Kirkenes", TimeSpan.Parse("09:00"), TimeSpan.Parse("12:30"))
        };

        // Southbound routes
        private static readonly List<(string port, TimeSpan arrivalTime, TimeSpan departureTime)> KirkenesToTromsøSouthbound = new()
        {
            ("Kirkenes", TimeSpan.Parse("09:00"), TimeSpan.Parse("12:30")),
            ("Vadsø", TimeSpan.Parse("16:05"), TimeSpan.Parse("17:00")),
            ("Båtsfjord", TimeSpan.Parse("20:00"), TimeSpan.Parse("20:30")),
            ("Berlevåg", TimeSpan.Parse("22:25"), TimeSpan.Parse("22:35")),
            ("Mehamn", TimeSpan.Parse("01:20"), TimeSpan.Parse("01:30")),
            ("Kjøllefjord", TimeSpan.Parse("03:25"), TimeSpan.Parse("03:35")),
            ("Honningsvåg", TimeSpan.Parse("05:45"), TimeSpan.Parse("06:00")),
            ("Havøysund", TimeSpan.Parse("08:00"), TimeSpan.Parse("08:15")),
            ("Hammerfest", TimeSpan.Parse("11:00"), TimeSpan.Parse("12:45")),
            ("Øksfjord", TimeSpan.Parse("15:50"), TimeSpan.Parse("16:06")),
            ("Skjervøy", TimeSpan.Parse("19:30"), TimeSpan.Parse("19:45")),
            ("Tromsø", TimeSpan.Parse("23:45"), TimeSpan.Parse("01:30"))
        };

        private static readonly List<(string port, TimeSpan arrivalTime, TimeSpan departureTime)> TromsøToTrondheimSouthbound = new()
        {
            ("Tromsø", TimeSpan.Parse("23:45"), TimeSpan.Parse("01:30")),
            ("Finnsnes", TimeSpan.Parse("04:20"), TimeSpan.Parse("04:40")),
            ("Harstad", TimeSpan.Parse("08:00"), TimeSpan.Parse("08:30")),
            ("Risøyhamn", TimeSpan.Parse("10:45"), TimeSpan.Parse("11:00")),
            ("Sortland", TimeSpan.Parse("12:30"), TimeSpan.Parse("13:00")),
            ("Stokmarknes", TimeSpan.Parse("14:15"), TimeSpan.Parse("15:15")),
            ("Svolvær", TimeSpan.Parse("18:30"), TimeSpan.Parse("20:30")),
            ("Stamsund", TimeSpan.Parse("22:15"), TimeSpan.Parse("22:30")),
            ("Bodø", TimeSpan.Parse("02:30"), TimeSpan.Parse("03:30")),
            ("Ørnes", TimeSpan.Parse("06:25"), TimeSpan.Parse("06:35")),
            ("Nesna", TimeSpan.Parse("10:25"), TimeSpan.Parse("10:35")),
            ("Sandnessjøen", TimeSpan.Parse("11:45"), TimeSpan.Parse("12:15")),
            ("Brønnøysund", TimeSpan.Parse("15:00"), TimeSpan.Parse("17:25")),
            ("Rørvik", TimeSpan.Parse("21:00"), TimeSpan.Parse("21:30")),
            ("Trondheim", TimeSpan.Parse("06:30"), TimeSpan.Parse("09:30"))
        };

        private static readonly List<(string port, TimeSpan arrivalTime, TimeSpan departureTime)> TrondheimToBergenSouthbound = new()
        {
            ("Trondheim", TimeSpan.Parse("06:30"), TimeSpan.Parse("09:30")),
            ("Kristiansund", TimeSpan.Parse("16:30"), TimeSpan.Parse("17:30")),
            ("Molde", TimeSpan.Parse("21:15"), TimeSpan.Parse("21:45")),
            ("Ålesund", TimeSpan.Parse("00:30"), TimeSpan.Parse("01:20")),
            ("Torvik", TimeSpan.Parse("02:35"), TimeSpan.Parse("02:45")),
            ("Måløy", TimeSpan.Parse("05:45"), TimeSpan.Parse("06:00")),
            ("Florø", TimeSpan.Parse("08:15"), TimeSpan.Parse("08:30")),
            ("Bergen", TimeSpan.Parse("14:45"), TimeSpan.Parse("20:30"))
        };

        public static void SeedDatabase(RoutesDbContext context)
        {
            // Ensure database is deleted and recreated
            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();

            // List of ships
            var ships = new string[]
            {
                "MS Havila Capella", "MS Havila Castor", "MS Havila Polaris", "MS Havila Pollux"
            };

            // Create routes
            var routes = new List<VoyageRoute>();

            // Calculate the date range
            var startDate = DateTime.UtcNow;
            var endDate = startDate.AddMonths(5);

            // Stagger the initial departures for each ship
            var shipDepartureTimes = new DateTime[4];
            for (int i = 0; i < 4; i++)
            {
                shipDepartureTimes[i] = startDate.AddDays(i * 3); // Stagger starts by 3 days
            }

            // Generate routes for each ship
            while (shipDepartureTimes.Min() < endDate)
            {
                for (int shipIndex = 0; shipIndex < 4; shipIndex++)
                {
                    // Skip if this ship is already scheduled past the end date
                    if (shipDepartureTimes[shipIndex] >= endDate) continue;

                    // Create the complete voyage for this ship
                    DateTime currentDate = shipDepartureTimes[shipIndex];
                    string shipName = ships[shipIndex];

                    // 1. Bergen to Trondheim (northbound)
                    var bergenToTrondheimRoute = CreateRoute(
                        BergenToTrondheimNorthbound,
                        shipName,
                        currentDate,
                        routes.Count + 1,
                        "Northbound: Bergen to Trondheim");
                    routes.Add(bergenToTrondheimRoute);

                    // Update the current date
                    currentDate = bergenToTrondheimRoute.ArrivalTime;

                    // 2. Trondheim to Tromsø (northbound)
                    var trondheimToTromsøRoute = CreateRoute(
                        TrondheimToTromsøNorthbound,
                        shipName,
                        currentDate,
                        routes.Count + 1,
                        "Northbound: Trondheim to Tromsø");
                    routes.Add(trondheimToTromsøRoute);

                    // Update the current date
                    currentDate = trondheimToTromsøRoute.ArrivalTime;

                    // 3. Tromsø to Kirkenes (northbound)
                    var tromsøToKirkenesRoute = CreateRoute(
                        TromsøToKirkenesNorthbound,
                        shipName,
                        currentDate,
                        routes.Count + 1,
                        "Northbound: Tromsø to Kirkenes");
                    routes.Add(tromsøToKirkenesRoute);

                    // Update the current date (allow some time in Kirkenes)
                    currentDate = tromsøToKirkenesRoute.ArrivalTime;

                    // 4. Kirkenes to Tromsø (southbound)
                    var kirkenesToTromsøRoute = CreateRoute(
                        KirkenesToTromsøSouthbound,
                        shipName,
                        currentDate,
                        routes.Count + 1,
                        "Southbound: Kirkenes to Tromsø");
                    routes.Add(kirkenesToTromsøRoute);

                    // Update the current date
                    currentDate = kirkenesToTromsøRoute.ArrivalTime;

                    // 5. Tromsø to Trondheim (southbound)
                    var tromsøToTrondheimRoute = CreateRoute(
                        TromsøToTrondheimSouthbound,
                        shipName,
                        currentDate,
                        routes.Count + 1,
                        "Southbound: Tromsø to Trondheim");
                    routes.Add(tromsøToTrondheimRoute);

                    // Update the current date
                    currentDate = tromsøToTrondheimRoute.ArrivalTime;

                    // 6. Trondheim to Bergen (southbound)
                    var trondheimToBergenRoute = CreateRoute(
                        TrondheimToBergenSouthbound,
                        shipName,
                        currentDate,
                        routes.Count + 1,
                        "Southbound: Trondheim to Bergen");
                    routes.Add(trondheimToBergenRoute);

                    // Update the departure time for the next full journey of this ship
                    shipDepartureTimes[shipIndex] = trondheimToBergenRoute.ArrivalTime.AddDays(1);

                    // Check if we've reached our limit for total routes
                    if (routes.Count >= 120) break;
                }

                if (routes.Count >= 120) break;
            }

            // Add routes to context and save
            context.Routes.AddRange(routes);
            context.SaveChanges();

            Console.WriteLine($"Database seeded with {routes.Count} routes from {startDate} to {endDate}.");
        }

        private static VoyageRoute CreateRoute(
            List<(string port, TimeSpan arrivalTime, TimeSpan departureTime)> portSchedule,
            string shipName,
            DateTime departureDate,
            int routeNumber,
            string routeDescription)
        {
            var firstPort = portSchedule.First();
            var lastPort = portSchedule.Last();

            // Adjust the departure date to match the first port departure time
            DateTime adjustedDepartureDate = departureDate.Date;

            // If the current time is later than the scheduled departure, move to the next day
            if (departureDate.TimeOfDay > firstPort.departureTime)
            {
                adjustedDepartureDate = departureDate.Date.AddDays(1);
            }

            // Create base route
            var route = new VoyageRoute
            {
                DeparturePort = firstPort.port,
                ArrivalPort = lastPort.port,
                DepartureTime = adjustedDepartureDate.Add(firstPort.departureTime),
                // For arrival time, we need to calculate the correct day
                ShipName = shipName,
                Price = 400 + (routeNumber * 100),
                AvailableSeats = 200,
                IsActive = true,
                RouteCode = $"HV-{1000 + routeNumber}",
                Description = routeDescription
            };

            // Calculate the total days for the journey
            int journeyDays = 0;
            var prevTime = firstPort.departureTime;

            foreach (var port in portSchedule.Skip(1))
            {
                // If the current port time is earlier than the previous port time, we've crossed midnight
                if (port.arrivalTime < prevTime)
                {
                    journeyDays++;
                }
                prevTime = port.departureTime;
            }

            route.ArrivalTime = adjustedDepartureDate.Add(lastPort.departureTime).AddDays(journeyDays);

            // Create route stops
            route.Stops = new List<RouteStop>();

            int dayCounter = 0;
            TimeSpan previousTime = firstPort.departureTime;

            for (int i = 1; i < portSchedule.Count - 1; i++)
            {
                var stop = portSchedule[i];

                // Check if we've crossed midnight
                if (stop.arrivalTime < previousTime)
                {
                    dayCounter++;
                }

                route.Stops.Add(new RouteStop
                {
                    PortName = stop.port,
                    ArrivalTime = adjustedDepartureDate.Add(stop.arrivalTime).AddDays(dayCounter),
                    DepartureTime = adjustedDepartureDate.Add(stop.departureTime).AddDays(dayCounter),
                    StopOrder = i
                });

                previousTime = stop.departureTime;
            }

            return route;
        }
    }
}