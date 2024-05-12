namespace AsimKiosk.Contracts.Rating;

public class RatingRequest
{
    public string OrderCode { get; set; } = string.Empty;
    public int PointRating { get; set; }
}