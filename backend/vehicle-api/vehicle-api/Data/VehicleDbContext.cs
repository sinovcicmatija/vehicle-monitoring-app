using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using vehicle_api.Models;

namespace vehicle_api.Data;

public partial class VehicleDbContext : DbContext
{
    public VehicleDbContext()
    {
    }

    public VehicleDbContext(DbContextOptions<VehicleDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Car> Cars { get; set; }

    public virtual DbSet<OwnershipHistory> OwnershipHistories { get; set; }

    public virtual DbSet<ServiceHistory> ServiceHistories { get; set; }

    public virtual DbSet<ServiceType> ServiceTypes { get; set; }

    public virtual DbSet<User> Users { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Car>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Car__3214EC07A58209E8");

            entity.ToTable("Car");

            entity.HasIndex(e => e.Vin, "UQ__Car__C5DF234CE26A12C8").IsUnique();

            entity.Property(e => e.Brand).HasMaxLength(50);
            entity.Property(e => e.EngineType).HasMaxLength(20);
            entity.Property(e => e.Model).HasMaxLength(50);
            entity.Property(e => e.Vin)
                .HasMaxLength(50)
                .HasColumnName("VIN");
        });

        modelBuilder.Entity<OwnershipHistory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Ownershi__3214EC07AEFA6C96");

            entity.ToTable("OwnershipHistory");

            entity.HasOne(d => d.Car).WithMany(p => p.OwnershipHistories)
                .HasForeignKey(d => d.CarId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CarOwnershipHistory");

            entity.HasOne(d => d.User).WithMany(p => p.OwnershipHistories)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_UserOwnershipHistory");
        });

        modelBuilder.Entity<ServiceHistory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__ServiceH__3214EC074A2CA124");

            entity.ToTable("ServiceHistory");

            entity.HasOne(d => d.Car).WithMany(p => p.ServiceHistories)
                .HasForeignKey(d => d.CarId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CarServiceHistory");

            entity.HasOne(d => d.ServiceType).WithMany(p => p.ServiceHistories)
                .HasForeignKey(d => d.ServiceTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ServiceTypeServiceHistory");
        });

        modelBuilder.Entity<ServiceType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__ServiceT__3214EC07D2AA4A24");

            entity.ToTable("ServiceType");

            entity.Property(e => e.ServiceName).HasMaxLength(100);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Users__3214EC07B653B955");

            entity.HasIndex(e => e.Username, "UQ__Users__536C85E434247A76").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__Users__A9D105348EF0709B").IsUnique();

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Email).HasMaxLength(50);
            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.LastName).HasMaxLength(50);
            entity.Property(e => e.PasswordHash).HasMaxLength(200);
            entity.Property(e => e.Username).HasMaxLength(50);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
