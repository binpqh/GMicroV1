namespace AsimKiosk.Application.Core.Common;

public interface IDateTime
{
    /// <summary>
    /// Gets the current date and time in UTC format.
    /// </summary>
    string Now { get; }
    DateTime LocalTime(DateTime utcTime);
    long GetUnixTime { get; }
}