using System.ComponentModel.DataAnnotations;

namespace LiveStreamAPI6.Core.Entities
{
    public class Comment
    {
        [Key]
        public Guid Id { get; set; }
        public string NoiDung { get; set; }
        public DateTime DatePosted { get; set; } = DateTime.Now;
        public Post Post { get; set; }
        public Guid PostId { get; set; }
        public AppUser AppUser { get; set; }
        public string UserId { get; set; }
    }
}
