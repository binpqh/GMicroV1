using AsimKiosk.Application.Core.Common;

namespace AsimKiosk.Infrastructure.Common.TimeUTC;

/// <summary>
/// Represents the machine date time service.
/// </summary>
internal sealed class MachineDateTime : IDateTime
{
    public string Now => DateTime.UtcNow.ToString("HH:mm:ss dd-MM-yyyy");
    public DateTime LocalTime(DateTime utcTime) => utcTime.ToLocalTime();
    public long GetUnixTime => ((DateTimeOffset)DateTime.Now).ToUnixTimeMilliseconds();
}
