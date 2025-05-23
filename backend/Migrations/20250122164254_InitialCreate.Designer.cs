﻿// <auto-generated />
using AppProject.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace appProject.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20250122164254_InitialCreate")]
    partial class InitialCreate
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.1")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("AppProject.Models.Booking", b =>
                {
                    b.Property<int>("BookingID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("BookingID"));

                    b.Property<string>("BookingDate")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("PassengerID")
                        .HasColumnType("integer");

                    b.Property<double>("Pris")
                        .HasColumnType("double precision");

                    b.Property<int>("RouteID")
                        .HasColumnType("integer");

                    b.Property<int>("Tickets")
                        .HasColumnType("integer");

                    b.HasKey("BookingID");

                    b.ToTable("bookings", "mobileapp");
                });

            modelBuilder.Entity("AppProject.Models.Passenger", b =>
                {
                    b.Property<int>("PassengerID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("PassengerID"));

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("phone")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("PassengerID");

                    b.ToTable("passengers", "mobileapp");
                });

            modelBuilder.Entity("AppProject.Models.Port", b =>
                {
                    b.Property<int>("PortID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("PortID"));

                    b.Property<string>("Location")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("PortID");

                    b.ToTable("ports", "mobileapp");
                });

            modelBuilder.Entity("AppProject.Models.Route", b =>
                {
                    b.Property<int>("RouteID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("RouteID"));

                    b.Property<string>("ArrivalTime")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("DepartureTime")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Destination")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("ShipID")
                        .HasColumnType("integer");

                    b.Property<string>("StartLocation")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("RouteID");

                    b.ToTable("routes", "mobileapp");
                });

            modelBuilder.Entity("AppProject.Models.Ship", b =>
                {
                    b.Property<int>("ShipID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ShipID"));

                    b.Property<int>("capacity")
                        .HasColumnType("integer");

                    b.Property<string>("name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("ShipID");

                    b.ToTable("ships", "mobileapp");
                });
#pragma warning restore 612, 618
        }
    }
}
