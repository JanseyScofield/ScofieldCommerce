namespace ScofieldCommerce.Domain.Common
{
    public class Result<T>
    {
        public bool IsSuccess { get; }
        public T? Data { get; }
        public string? ErrorMessage { get; }

        private Result(bool isSuccess, T? data, string? errorMessage)
        {
            IsSuccess = isSuccess;
            Data = data;
            ErrorMessage = errorMessage;
        }

        public static Result<T> Ok(T data) => new Result<T>(true, data, null);
        
        public static Result<T> Error(string errorMessage) => new Result<T>(false, default, errorMessage);
    }
}
