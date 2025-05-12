using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AppProject.Data;
using AppProject.Models;

namespace AppProject.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class PassengersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PassengersController(AppDbContext context)
        {
            _context = context;
        }
        /// <summary>
        /// Henter alle passasjerer i systemet.
        /// </summary>
        /// <returns>Alle passasjerer i systemet</returns> 
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Passenger>>> GetPassengers()
        {
            return await _context.Passengers.ToListAsync();
        }
        /// <summary>
        ///  Henter en spesifikk passasjer basert på ID.
        /// </summary>
        /// <param name="id">Id</param>
        /// <returns>Passasjer med gitt id</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<Passenger>> GetPassenger(int id)
        {
            var passenger = await _context.Passengers.FindAsync(id);
            if (passenger == null)
            {
                return NotFound();
            }
            return passenger;
        }
    }
}