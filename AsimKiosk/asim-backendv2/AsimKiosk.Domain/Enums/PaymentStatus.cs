namespace AsimKiosk.Domain.Enums;

public enum PaymentStatus
{
    Failed = -1,
    Processing = 0,
    Success = 1,
    All = 2, // for querying data with the front-end layer only, do not use for storing values in database
}
public enum OrderStatus
{
    Cancelled = -1,
    Processing = 0,
    Success = 1,
    Failed = 2,
    All = 3, // for querying data with the front-end layer only, do not use for storing values in database\
    SomeCardsAreNotTaken = 4
}