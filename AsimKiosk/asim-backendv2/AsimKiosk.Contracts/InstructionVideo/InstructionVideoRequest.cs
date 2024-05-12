using Microsoft.AspNetCore.Http;

namespace AsimKiosk.Contracts.InstructionVideo;

public class InstructionVideoRequest
{
    public IFormFile VideoFile { get; set; } = null!;
}