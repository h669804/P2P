using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppProject.Models
{
    [Table("users", Schema = "mobileapp")]
    public class User
    {
        [Column("id")]
        public int UserId { get; set; }

        [Column("first_name")]
        public string FirstName { get; set; }

        [Column("last_name")]
        public string LastName { get; set; }

        [Column("email")]
        public string Email { get; set; }

        [Column("password")]
        public string Password { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}