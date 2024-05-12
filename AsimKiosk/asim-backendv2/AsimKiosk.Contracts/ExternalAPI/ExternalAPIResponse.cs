
namespace AsimKiosk.Contracts.ExternalAPI
{
    public class ExternalAPIResponse
    {
        public string Id { get; set; } = null!;
        public string? Owner { get; set; }
        public string? NameAPI { get; set; }
        public string RequestType { get; set; } = null!;
        public string Method { get; set; } = null!;
        public string BaseUrl { get; set; } = null!;
        public string? Example { get; set; }
        public DateTime ModifiedOn { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
