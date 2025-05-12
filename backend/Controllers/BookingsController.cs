using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AppProject.Data;
using AppProject.Models;

namespace AppProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BookingsController(AppDbContext context)
        {
            _context = context;
        }
        /// <summary>
        /// Returnerer alle brukere i systemet.
        /// </summary>
        /// <returns>En liste med brukerobjekter.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookings()
        {
            return await _context.Bookings.ToListAsync();
        }
        /// <summary>
        /// Henter en spesifikk booking basert på ID.
        /// </summary>
        /// <param name="id">Id</param>
        /// <returns>Booking med gitt id</returns> 
        [HttpGet("{id}")]
        public async Task<ActionResult<Booking>> GetBooking(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound();
            }
            return booking;
        }
    }
}