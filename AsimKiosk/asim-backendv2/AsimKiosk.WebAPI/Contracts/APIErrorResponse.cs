using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.WebAPI.Contracts
{
    /// <summary>
    /// Represents API an error response.
    /// </summary>
    public class APIErrorResponse
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ApiErrorResponse"/> class.
        /// </summary>
        /// <param name="errors">The enumerable collection of errors.</param>
        public APIErrorResponse(string errorMessage, IDictionary<string, string> errors)
        {
            Message = errorMessage;
            Errors = errors;
        }
       
        public bool Status { get; } = false;
        public string Message { get; set; }
        /// <summary>
        /// Gets the errors.
        /// </summary>
        public IDictionary<string, string> Errors { get; }
        
    }
}
