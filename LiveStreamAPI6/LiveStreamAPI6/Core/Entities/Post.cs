using System.ComponentModel.DataAnnotations;

namespace LiveStreamAPI6.Core.Entities
{
    #nullable enable
    public class Post
    {
        [Key]
        public Guid Id { get; set; }
        public string? NoiDung { get; set; }
        public string? SrcVideo { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.Now;
        public AppUser? User { get; set; }
        public string? UserId { get; set; }
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}
