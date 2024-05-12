using System.Text;

namespace AsimKiosk.Application.Core.Common
{
    public static class StringHelper
    {
        public static string LowercaseFirstWord(string value)
        {
            if (string.IsNullOrEmpty(value))
                return string.Empty;
            return char.ToLower(value[0]) + value.Substring(1);
        }
        public static string AddSpaceBeforeUpperCase(string input)
        {
            if (string.IsNullOrEmpty(input))
            {
                return input;
            }

            var result = new StringBuilder(input.Length * 2);
            result.Append(input[0]);

            for (int i = 1; i < input.Length; i++)
            {
                if (char.IsUpper(input[i]))
                {
                    result.Append(' ');
                }
                result.Append(input[i]);
            }

            return result.ToString();
        }
    }
}
