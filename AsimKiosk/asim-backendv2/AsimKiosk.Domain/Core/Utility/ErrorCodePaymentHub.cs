namespace AsimKiosk.Domain.Core.Utility;

public static class ErrorCodePaymentHub
{
    public static string GetErrorMessage(string errorCode)
    {
        switch (errorCode)
        {
            case "PS101":
                return "Invalid input.";
            case "PS102":
                return "Can't load partner's plugin.";
            case "PS103":
                return "Partner hasn't implemented yet.";
            case "PS107":
                return "The payment configuration does not exist.";
            case "PS108":
                return "Invalid signature.";
            case "PS109":
                return "Transaction doesn't exist.";
            case "PS110":
                return "Create transaction error.";
            case "PS115":
                return "No merchant information found.";
            case "PS116":
                return "The order has been paid.";
            case "S200":
                return "Success";
            case "S101":
                return "The error hasn't been defined.";
            default:
                return $"Unknown error : {errorCode}.";
        }
    }
}
