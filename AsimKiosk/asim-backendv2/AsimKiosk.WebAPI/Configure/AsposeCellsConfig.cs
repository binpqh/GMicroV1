using Aspose.Cells;

namespace AsimKiosk.WebAPI.Configure
{
    public static class AsposeCellsConfig
    {
        public static void ConfigureAsposeCells(this IServiceCollection services)
        {
            const string dataModuleName = "AsimKiosk.Infrastructure";
            const string pathToLicenseFile = @"AsimKiosk.Infrastructure.Common.Document.License.License.xml";

            var moduleData = AppDomain.CurrentDomain.GetAssemblies()
                .FirstOrDefault(domain => domain.FullName!.Contains(dataModuleName));

            if (moduleData is null)
            {
                throw new Exception("Can't find module");
            }

            var resourceName = moduleData.GetManifestResourceNames()
                                .FirstOrDefault(name => name.EndsWith(pathToLicenseFile));

            if (resourceName is null)
            {
                throw new Exception($"Can't find license at {pathToLicenseFile}");
            }

            var stream = moduleData.GetManifestResourceStream(resourceName);

            try
            {
                var license = new License();
                license.SetLicense(stream);

                Console.WriteLine("*** Set Aspose License Successfully ***");
            }
            catch (Exception ex)
            {
                Console.WriteLine("\nThere was an error setting the license: " + ex.Message);
            }
        }
    }
}
