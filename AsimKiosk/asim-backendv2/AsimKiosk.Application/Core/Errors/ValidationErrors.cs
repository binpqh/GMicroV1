using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Errors
{
    public static class ValidationErrors
    {
        /// <summary>
        /// Contains the general errors.
        /// </summary>
        public static class General
        {
            internal static Error InvalidObjectId => new("BRI00", $"The identifier field must be a hex string with 24 digits.");
            internal static Error IsRequired(string propName) => new("BRR00", $"The {propName} is required.");
        }
        public static class User
        {
            internal static Error InvalidRole => new("EUR41", "This role is not valid");
            internal static Error PasswordDoesNotMatch => new("EUP42", "The password does not match");
        }
        public static class UpdateKiosk
        {
            internal static Error InvalidService => new("InvalidService", "The parsed service is not valid.");
            internal static Error InvalidStatus => new("InvalidStatus", "The parsed status is not valid.");
        }
        public static class WarehouseTicket
        {
            internal static Error QuantityListEmpty => new("WT491", "The quantity list must have at least 1 item.");
            internal static Error QuantityListExceededLimit => new("WT492", "The quantity list must contain fewer than 4 items.");
            internal static Error QuantityMismatched => new("WT495", "Quantity must be equal to (To - From) when both From and To have values.");
            internal static Error NegativeNumber = new("WT496", "The input value must not be a negative number");
            internal static Error InvalidValue = new("WT400", "The value of the To field must be greater than or equal to the To field");
            internal static Error InvalidExtension = new("WT497", "Invalid file extension. Allowed extensions are: .jpg, .jpeg, .png, .pdf");
            internal static Error InvalidSlot = new("WT498", "The dispenser slot must be between 1 and 4");
            internal static Error InvalidStatus => new("WT499", "The input status must be 'Pending' or 'Completed'.");
        }
        public static class Report 
        {
            internal static Error RowDataEmpty => new("RER404", "Row data can not be empty.");
        }
    }
}