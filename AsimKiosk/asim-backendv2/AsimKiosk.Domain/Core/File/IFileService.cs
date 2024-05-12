using AsimKiosk.Domain.Enums;
using Microsoft.AspNetCore.Http;

namespace AsimKiosk.Domain.Core.File;

public interface IFileService
{
    Task<string> SaveVideoAsync(IFormFile videoFile, string fileName);
    Task<(string,string)> SaveInstructionVideoAsync(IFormFile videoFile);
    string SaveImage(IFormFile images, string fileName);
    string SaveImage(IFormFile file, ImageType type);
    string SaveImage(IFormFile file, string productCode, ImageType type);
    string SaveImage(IFormFile file, string productCode, string itemCode, ImageType type);
    (string, string) SaveTicketDocument(IFormFile file, string deviceId);
    string UpdateImage(IFormFile images, string filePath, string fileName);
    void RollBackImageJustUpload(List<string> images);
    void DeleteImage(string fileName);
    string GetImageByKey(string imgKey);
    string GetDocumentURLByKey(string key);
    List<string> GetImageByKey(List<string> imgKey);
}