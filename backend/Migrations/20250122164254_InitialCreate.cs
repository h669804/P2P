using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace appProject.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "mobileapp");

            migrationBuilder.CreateTable(
                name: "bookings",
                schema: "mobileapp",
                columns: table => new
                {
                    BookingID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PassengerID = table.Column<int>(type: "integer", nullable: false),
                    RouteID = table.Column<int>(type: "integer", nullable: false),
                    Tickets = table.Column<int>(type: "integer", nullable: false),
                    Pris = table.Column<double>(type: "double precision", nullable: false),
                    BookingDate = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_bookings", x => x.BookingID);
                });

            migrationBuilder.CreateTable(
                name: "passengers",
                schema: "mobileapp",
                columns: table => new
                {
                    PassengerID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    phone = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_passengers", x => x.PassengerID);
                });

            migrationBuilder.CreateTable(
                name: "ports",
                schema: "mobileapp",
                columns: table => new
                {
                    PortID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Location = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ports", x => x.PortID);
                });

            migrationBuilder.CreateTable(
                name: "routes",
                schema: "mobileapp",
                columns: table => new
                {
                    RouteID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    StartLocation = table.Column<string>(type: "text", nullable: false),
                    Destination = table.Column<string>(type: "text", nullable: false),
                    DepartureTime = table.Column<string>(type: "text", nullable: false),
                    ArrivalTime = table.Column<string>(type: "text", nullable: false),
                    ShipID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_routes", x => x.RouteID);
                });

            migrationBuilder.CreateTable(
                name: "ships",
                schema: "mobileapp",
                columns: table => new
                {
                    ShipID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false),
                    capacity = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ships", x => x.ShipID);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "bookings",
                schema: "mobileapp");

            migrationBuilder.DropTable(
                name: "passengers",
                schema: "mobileapp");

            migrationBuilder.DropTable(
                name: "ports",
                schema: "mobileapp");

            migrationBuilder.DropTable(
                name: "routes",
                schema: "mobileapp");

            migrationBuilder.DropTable(
                name: "ships",
                schema: "mobileapp");
        }
    }
}
