using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.KioskApplication.Queries.GetAssets;

public class GetAssetsKioskQueryHandler : IQueryHandler<GetAssetsKioskQuery, Maybe<IEnumerable<string>>>
{
    public Task<Maybe<IEnumerable<string>>> Handle(GetAssetsKioskQuery request, CancellationToken cancellationToken)
    {
        string assetsDirectory = Path.Combine(Directory.GetCurrentDirectory(), @"Resources/Images");
        // List of prefixes to filter files
        List<string> prefixesToFilter = ["BANNER_", "VIEW_", "Banner_", "Preview_"];

        // Get a list of file paths with the specified prefixes
        List<string> filteredFiles = GetFilesWithPrefix(assetsDirectory, prefixesToFilter);

        var result = GetUrlFromFilePath(filteredFiles, request.HostName);
        return Task.FromResult<Maybe<IEnumerable<string>>>(result.ToArray());
    }

    static List<string> GetFilesWithPrefix(string directory, List<string> prefixes)
    {
        List<string> filePaths = [];
        filePaths.AddRange(Directory.GetFiles(directory).Where(filename => prefixes.Any(prefix => Path.GetFileName(filename).StartsWith(prefix))));

        return filePaths;
    }

    static IEnumerable<string> GetUrlFromFilePath(List<string> filePaths, string host)
    {
        return filePaths.Select(ExtractValueFromAssets).Select(pathArr => $"{host}/{pathArr}");
    }


    private static string ExtractValueFromAssets(string fullPath)
    {
        // Get the file or directory name from the given path
        string fileName = Path.GetFileName(fullPath);

        // Find the position of "assets" in the path
        int assetsIndex = fullPath.IndexOf("Resources/Images", StringComparison.OrdinalIgnoreCase);

        return assetsIndex != -1 ?
            // Extract the substring from "assets" to the end
            fullPath.Substring(assetsIndex) :
            // If "assets" is not found, return the original file or directory name
            fileName;
    }
}
