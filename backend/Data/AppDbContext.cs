using Microsoft.EntityFrameworkCore;
using AppProject.Models;

namespace AppProject.Data
{
    public class AppDbContext : DbContext
    {

        
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Port> Ports { get; set; }
        public DbSet<Ship> Ships { get; set; }
        public DbSet<Passenger> Passengers { get; set; }
        public DbSet<User> Users { get; set; }

        public DbSet<AppProject.Models.VoyageRoute> Routes { get; set; }

        public DbSet<Booking> Bookings { get; set; }
         public DbSet<CabinCategory> CabinCategories { get; set; }
        public DbSet<CabinOption> CabinOptions { get; set; }

        public DbSet<SusFeedback> SusFeedbacks { get; set; }
    
    }
}