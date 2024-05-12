using AsimKiosk.Application.Core.Common;
using AsimKiosk.Domain.Core.File;
using AsimKiosk.Domain.Enums;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace AsimKiosk.Infrastructure.Common.File;

internal class FileService(
    IWebHostEnvironment webHostEnvironment,
    IHttpContextAccessor httpContextAccessor,
    IDateTime dateTime)
    : IFileService
{
    public void DeleteImage(string fileName)
    {
        if(System.IO.File.Exists(webHostEnvironment.ContentRootPath + "Resources/Images/" + fileName))
        {
            System.IO.File.Delete(webHostEnvironment.ContentRootPath + "Resources/Images/" + fileName);
        }
    }

    public void RollBackImageJustUpload(List<string> images)
    {
        images.ForEach(image =>
        {
            int startIndex = image.LastIndexOf('_') + 1;
            int endIndex = image.LastIndexOf(".");

            if (startIndex > 0 && endIndex > startIndex)
            {
                string timeStampString = image.Substring(startIndex, endIndex - startIndex);
                if (long.TryParse(timeStampString, out long timestamp))
                {
                    DateTime dateTime = DateTimeOffset.FromUnixTimeMilliseconds(timestamp).DateTime;
                    TimeSpan timeDifference = DateTime.Now - dateTime;
                    if (Math.Abs(timeDifference.TotalMinutes) <= 2)
                    {
                        DeleteImage(image);
                    }
                }
            }
        });
    }

    public string SaveImage(IFormFile image, string fileName)
    {
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
        var fileExtension = Path.GetExtension(image.FileName).ToLower();

        if (!allowedExtensions.Contains(fileExtension))
        {
            throw new Exception();
        }

        var uniqueFileName = fileName + fileExtension;
        if (!Directory.Exists(webHostEnvironment.ContentRootPath + "Resources/Images"))
        {
            Directory.CreateDirectory(webHostEnvironment.ContentRootPath + "Resources/Images");
        }
        var filePath = Path.Combine(webHostEnvironment.ContentRootPath, "Resources/Images", uniqueFileName);
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            image.CopyTo(stream);
            stream.Close();
        }
        return GetBaseUrl() + "/Resources/Images/" + uniqueFileName;
    }

    public string SaveImage(IFormFile file, string productCode, ImageType type)
    {
        string typeName = type.ToString();
        var fileExtension = Path.GetExtension(file.FileName).ToLower();
        var fileName = $"{typeName}_{productCode.ToUpper().Trim()}_{dateTime.GetUnixTime}";
        SaveImage(file, fileName);
        return $"{fileName}{fileExtension}";
    }

    public string SaveImage(IFormFile file, ImageType type)
    {
        string typeName = type.ToString();
        var fileExtension = Path.GetExtension(file.FileName).ToLower();
        var fileName = $"{typeName}_{dateTime.GetUnixTime}";
        SaveImage(file, fileName);
        return $"{fileName}{fileExtension}";
    }

    public string SaveImage(IFormFile file, string productCode, string itemCode, ImageType type)
    {
        var typeName = type.ToString();
        var fileExtension = Path.GetExtension(file.FileName).ToLower();
        var fileName = $"{typeName}_{productCode.ToUpper().Trim()}_{itemCode.ToUpper().Trim()}_{dateTime.GetUnixTime}";
        SaveImage(file, fileName);
        return $"{fileName}{fileExtension}";
    }

    public (string, string) SaveTicketDocument(IFormFile file, string deviceId)
    {
        //used for Warehouse Tickets only
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".pdf" };
        var fileExtension = Path.GetExtension(file.FileName).ToLower();
        if (!allowedExtensions.Contains(fileExtension))
        {
            throw new Exception();
        }

        var fileType = Path.GetExtension(file.FileName).ToLower().Equals(".pdf") ? UploadType.Document.ToString() : UploadType.Image.ToString();
        var fileName = $"WarehouseTicket_{fileType}_{deviceId.ToUpper()}_{DateTime.UtcNow.ToString("dd-MM-yyyy")}";

        if (!Directory.Exists(Path.Combine(webHostEnvironment.ContentRootPath, "Resources", "Documents")))
        {
            Directory.CreateDirectory(Path.Combine(webHostEnvironment.ContentRootPath, "Resources", "Documents"));
        }

        var filePath = Path.Combine(webHostEnvironment.ContentRootPath, "Resources", "Documents", $"{fileName}{fileExtension}");
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            file.CopyTo(stream);
            stream.Close();
        }
        return ($"{fileName}{fileExtension}", fileType);
    }

    public string UpdateImage(IFormFile image, string oldPath, string fileName)
    {
        string filePath = Path.Combine(webHostEnvironment.WebRootPath, oldPath);
        if (System.IO.File.Exists(filePath))
        {
            System.IO.File.Delete(filePath);
        }
        return SaveImage(image, fileName);
    }

    private string GetBaseUrl()
    {
        var httpContext = httpContextAccessor.HttpContext;
        var ipAddress = $"{httpContext!.Request.Scheme}://{httpContext.Request.Host}{httpContext.Request.PathBase}";
        return ipAddress;
    }

    public string GetImageByKey(string imgKey)
    {
        var httpContext = httpContextAccessor.HttpContext;
        var ipAddress = $"{httpContext!.Request.Scheme}://{httpContext.Request.Host}{httpContext.Request.PathBase}/Resources/Images/{imgKey}";
        return ipAddress;
    }

    public string GetDocumentURLByKey(string key)
    {
        var httpContext = httpContextAccessor.HttpContext;
        return $"{httpContext!.Request.Scheme}://{httpContext.Request.Host}{httpContext.Request.PathBase}/Resources/Documents/{key}";
    }

    public List<string> GetImageByKey(List<string> imgKey)
    {
        List<string> imgs = [];
        imgKey.ForEach(i => imgs.Add(GetImageByKey(i)));
        return imgs;
    }

    public async Task<string> SaveVideoAsync(IFormFile videoFile, string fileName)
    {
        if (!Directory.Exists(webHostEnvironment.ContentRootPath + "Resources/Videos"))
        {
            Directory.CreateDirectory(webHostEnvironment.ContentRootPath + "Resources/Videos");
        }
        var filePath = Path.Combine(webHostEnvironment.ContentRootPath, "Resources/Videos", fileName);
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await videoFile.CopyToAsync(stream);
            stream.Close();
        }
        return GetBaseUrl() + "/Resources/Videos/" + fileName;
    }
    public async Task<(string,string)> SaveInstructionVideoAsync(IFormFile videoFile)
    {
        try
        {
            if (!Directory.Exists(webHostEnvironment.ContentRootPath + "Resources/Videos"))
            {
                Directory.CreateDirectory(webHostEnvironment.ContentRootPath + "Resources/Videos");
            }
            var fileName = $"InstructionVideo_{dateTime.GetUnixTime}.mp4";
            var filePath = Path.Combine(webHostEnvironment.ContentRootPath, "Resources/Videos", fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await videoFile.CopyToAsync(stream);
                stream.Close();
            }
            return (GetBaseUrl() + "/Resources/Videos/" + fileName,fileName);
        }
        catch
        {
            return (string.Empty,string.Empty);
        }
        
    }
}
