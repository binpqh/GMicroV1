namespace AsimKiosk.Application.Core.Common;

public static class HexValidator
{
    public static bool BeAValidHex(string value)
    {
        return IsHex(value);
    }

    private static bool IsHex(string value)
    {
        return value is { Length: 24 } &&
               System.Text.RegularExpressions.Regex.IsMatch(value, @"\A\b[0-9a-fA-F]+\b\Z");
    }
}
