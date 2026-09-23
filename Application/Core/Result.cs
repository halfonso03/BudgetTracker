using System;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

namespace Application.Core;

public class Result<T>
{
    public bool IsSuccess { get; set; }
    public T? Value { get; set; }
    public string? Error { get; set; }
    public int Code { get; set; }

    public static Result<T> Success(T value) => new() { IsSuccess = true, Value = value };
    public static Result<T> Failure(string error, int code) => new()
    {
        IsSuccess = false,
        Error = error,
        Code = code
    };
}

public class FileResult<T> : Result<T>
{
    public byte[] Bytes { get; set; } = [];
    public required string ContentType { get; set; }
    public required string FileName { get; set; }
    public static FileResult<T> Success(byte[] bytes, string contentType, string fileName) => new() { IsSuccess = true, Bytes = bytes, ContentType = contentType, FileName = fileName };

}