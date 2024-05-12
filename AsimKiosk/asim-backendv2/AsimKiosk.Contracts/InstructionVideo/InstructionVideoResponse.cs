namespace AsimKiosk.Contracts.InstructionVideo;

public class ListInstructionVideoResponse
{
    public List<InstructionVideoResponse> Response { get; set; } = new();
}
public class InstructionVideoResponse
{
    public string Id { get; set; } = string.Empty;
    public string VideoUrl { get; set; } = string.Empty;
    public string VideoKey { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}
