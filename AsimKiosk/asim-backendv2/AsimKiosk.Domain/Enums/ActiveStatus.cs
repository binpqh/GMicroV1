namespace AsimKiosk.Domain.Enums
{
    public enum ActiveStatus
    {
        Active = 1,
        Inactive = 0,
        Deleted = -1
    }
    public static class ActiveStatusUtils
    {
        public static ActiveStatus ToEnum(string input)
        {
            var loweredInput = input.ToLower();
            switch (loweredInput)
            {
                case "active":
                    return ActiveStatus.Active;
                case "inactive":
                    return ActiveStatus.Inactive;
                case "isdeleted":
                    return ActiveStatus.Deleted;
                default:
                    throw new ArgumentOutOfRangeException(nameof(input));
            }
        }
    }
}
