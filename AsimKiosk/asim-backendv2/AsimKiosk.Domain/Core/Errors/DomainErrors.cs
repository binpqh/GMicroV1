using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;

namespace AsimKiosk.Domain.Core.Errors
{
    public static class DomainErrors
    {
        public static class Notification
        {
            public static Error ListOfNoticationMustNotEmpty => new("ENO95", "List of notifications must not empty.");
        }
        public static class Permission
        {
            public static Error InvalidPermissions => new("EP03", "You do not have the permissions to perform this action.");
        }
        public static class LogPeripherals
        {
            public static Error CanNotFoundIdDevice => new("LP01", "Can not found id device in the system.");
            public static Error DeviceIdPeripheralsNull => new("LP02", "Id device peripherals null, please check again.");
        }
        public static class Video
        {
            public static Error UploadVideoFailed => new("EV01", "Upload instruction video failed.");
            public static Error HasOneVideoActived => new("EV02", "Only one video is active at the same time.");
        }
        public static class Group
        {
            public static Error NotFoundWithId => new("EG04", "There is no group with identifier");
            public static Error GroupNotEmpty => new("EG09", "Cannot delete a group that has users");
            public static Error DuplicateName => new("EG05", "Group name provided is already used for another group.");
        }
        public static class ConfigSimLocal
        {
            public static Error CanNotDelete => new("CanNotDelete", "Can not delete Api Url active");
            public static Error NotFound => new("NotFound", "Id not matches any entity");
        }
        public static class Rating
        {
            public static Error OutOfRange => new("ER42", "The given rating must be a value between 1-5");
        }

        public static class Inventory
        {
            public static Error NotEnoughSlotToImport(int numAvailable) => new("EI08",
                $"There isn't enough slot to add more cards into dispenser.\nNumber available :{numAvailable}.");
            public static Error InvalidSlot => new("EI09",
                "Slot of dispenser is not in range of our system.");
        }

        public static class PaymentMethod
        {
            public static Error CanNotFetchPaymentMethodFromPaymentHub => new Error("EPM50",
                "Can not fetch payment method from Asim's payment hub.");
        }

        public static class Maintenance
        {
            public static Error NotEnoughProduct(string deviceId) => new("EM99",
                $"Products in kiosk which android identifier '{deviceId}' isn't enough for this transaction");
            public static Error NotFoundWithId => new("EM04", "There is no Ticket with identifier");
            public static Error CanNotDelete => new("EM05", "Can Not Delete Ticket Will Not Done ");
            public static Error OverHeading => new("T1", "Temperture Over Heading!!! Please Check Kiosk.");
            public static Error WaringPaper => new("P1", "Printer Wanring Paper !!! Please Check Paper In Printer.");
            public static Error UpsPower => new("Ups", "Kiosk lost Power !!! Please Check Kiosk.");
            public static Error Dispenserer => new("Dispenser", "Dispenser has full error tray.");
        }

        public static class Payment
        {
            public static Error NotFoundWithOrderCode(string orderCode) =>
                new("EPCODE04", $"There is no payment with order code : {orderCode}");
            public static Error NotFoundWithOrderId(string orderId) =>
               new("EPID04", $"There is no payment with orderId : {orderId}");
            public static Error FailTransactionFromPaymentHub(string transNo) => new("EP11",
                $"The payment with transaction number : {transNo} has been failed.");

            public static Error IsNotCompletedYet =>
                new("EP02", "The payment with order code isn't completed before.");

            public static Error FailTransactionFromUs =>
                new("EP00", "Something went wrong with our system.");
        }
        public static class PaymentConfig
        {
            public static Error DuplicateStatus => new("EPC03", "The status is already set before.");
            public static Error NotFoundWithId => new("EPC04", "There is no payment config with identifier.");
            public static Error DuplicateMerchantCode => new("EPC05", "The provided merchant code provided is already use.");
        }
        public static class Order
        {
            public static Error InventoryNotEnough => new("EO99",
                "Products in kiosk isn't enough for this transaction.");

            public static Error Ordering => new("EO02", "The order with order code being in process.");
        }
        public static class Banner
        {
            public static Error NotEnoughBanners => new("EB42", "Banners in request must be enough.");
        }
        public static class Product
        {
            public static Error DuplicateProductCode => new("EPO05", "The provided product code is already in use.");
            public static Error NotFound => new("EP04", "The product with the name wasn't found.");
            public static Error DeteleProductFailed(string exceptionMessage) => new("EPDP0", $"Something went wrong when you try to detele product with exception message:{exceptionMessage}");

            public static Error RegisterSimFailed => new("EP11", "Register packet sim has been failed.");

            public static Error UpdateFailed => new("EP42",
                "Some specified properties has been empty or upload images failed.");
            public static Error UploadImageFailed(string imgKey) => new("EPUM0",
                $"Something gonna be wrong with this image {imgKey}");
            public static Error UploadImageFailed() => new("EPUM0",
                "Something gonna be wrong with this image");

        }

        public static class Kiosk
        {
            public static Error NotFound => new("EK04",
               "The kiosk with android's specified identifier wasn't found in our system.", ErrorType.NotFound);
            public static Error PeripheralNotExist =>
                new("EKP04", "The specified peripheral device does not exist.");

            public static Error InvalidDispenser => new("EKD42", "The specified peripheral device is not a dispenser.");
            public static Error COMPortNotUnique => new("EKCOM44", "The input COM Port is already in use for this kiosk.");
            public static Error InvalidVideo => new("EKV42", "Invalid format of video file");
        }

        public static class WarehouseTicket
        {
            public static Error ImageRequired => new("EWT15", "A verification image is required to complete this action.");
            public static Error InvalidSlot => new("EWTS42", "The specified dispenser slot can not be found or is invalid.");
            public static Error TicketInProgress => new("EWT02", "The ticket is being processed.");
            public static Error AlreadyHandled => new("EWT22", "The specified product ticket item has already been handled.");

            public static Error InvalidItemCode(int slot, string itemCode) => new("EWTC42", $"The specified dispenser slot has invalid item code: {slot}, {itemCode}");

            public static Error SlotNotEnoughSpace(int slot, int remaining) => new("EWTS08", $"Slot {slot} only has enough space for {remaining} products!");
        }

        public static class User
        {
            public static Error DuplicateEmail => new("EUE05", "The provided user's email is already in use.");
            public static Error DuplicateUsername => new("EUE05", "The provided user's username is already in use.");
            public static Error DuplicateStatus => new("EUS05", "User's status is already set.");
            public static Error CannotChangePassword => new(
                "EUCP42",
                "The password cannot be changed to the specified password.");

            public static Error PasswordDoesNotMatch => new("EUP42", "The password does not match");
        }

        public static class UserAuthentication
        {
            public static Error InvalidUsername => new(
                "EUA04",
                "User does not exist."
            );

            public static Error InvalidPassword => new(
                "EUAP42",
                "Password is incorrect.");
            public static Error InvalidToken => new(
                "EUAT42",
                "Your token and IP doesn't match."
            );
        }
        public static class EndPoint
        {
            public static Error Duplicate => new("EEP03", "Endpoint provided is already existed.");
        }
        public static class General
        {
            public static Error FailRequest(object? obj)
            {
                if (obj is not null)
                {
                    return new("EG50", "The server could not process the request.");
                }
                return new("EG42", "Some properties has been null or empty which is required.");
            }

            public static Error NotFoundObject => new(
                "EG04",
                "There is no object contains your unique properties/specified identifier");

            public static Error UnProcessableRequest => new(
                "EG50",
                "The server could not process the request.");
            public static Error IsDuplicated => new("EGG69", "Duplicate object in our system");
            public static Error ServerError => new("EG00", "The server encountered an unrecoverable error.");
            public static Error NotFoundSpecificObject(string objectName) => new("EG04", $"There is no {objectName} contains your unique properties/specified identifier");
        }

        public static class Device
        {
            public static Error Dispenser => new($"EDD88", "Dispenser Have Error");
            public static Error Temperature => new("EDT88 ", "Temperature Hight In Kiosk");
            public static Error Printer => new("EDP88", "Printer Have Error");
            public static Error Ups => new("EDU88", "Ups Have Error");
            public static Error Locker => new("EDL88", "Locker have Error");

        }
    }
}
public static class ObjectName
{
    public static string Payment => "Payment";
    public static string Order => "Order";
    public static string PaymentConfiguration => "PaymentConfiguration";
    public static string EndPoint => "EndPoint";
    public static string User => "User";
    public static string Product => "Product";
    public static string Kiosk => "Kiosk";
    public static string Group => "Group";
    public static string Ticket => "Ticket";
    public static string Item => "Item";
    public static string Card => "Card";
    public static string Banner => "Banner";
    public static string PartnerCode => "PartnerCode";
}