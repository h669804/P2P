using Microsoft.EntityFrameworkCore;
using AppProject.Models;

namespace AppProject.Data
{
    public class RoutesDbContext : DbContext
    {
        public RoutesDbContext(DbContextOptions<RoutesDbContext> options) : base(options)
        {
        }

        public DbSet<VoyageRoute> Routes { get; set; }
        public DbSet<RouteStop> RouteStops { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships
            modelBuilder.Entity<RouteStop>()
                .HasOne(rs => rs.Route)
                .WithMany(r => r.Stops)
                .HasForeignKey(rs => rs.RouteId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure any additional model constraints
            modelBuilder.Entity<VoyageRoute>()
                .Property(r => r.Price)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<VoyageRoute>()
                .Property(r => r.DeparturePort)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<VoyageRoute>()
                .Property(r => r.ArrivalPort)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<VoyageRoute>()
                .Property(r => r.ShipName)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<RouteStop>()
                .Property(r => r.PortName)
                .IsRequired()
                .HasMaxLength(100);
        }
    }
}