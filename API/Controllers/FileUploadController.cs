using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileUploadController() : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> UploadFile(IFormFile file, CancellationToken cancellationToken)
        {
            if (file is null || file.Length == 0)
                return BadRequest("No file was uploaded.");

            if (file.Length > 3 * 1024 * 1000) return BadRequest("File length cannot be more than 3 MB's");

            // 1. Validate extension and MIME type
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (extension != ".pdf" || file.ContentType != "application/pdf")
                return BadRequest("Only valid PDF files are allowed.");

            // 2. Validate magic bytes (%PDF-) to ensure it isn't a renamed executable
            await using var stream = file.OpenReadStream();
            var header = new byte[5];
            var bytesRead = await stream.ReadAsync(header.AsMemory(0, 5), cancellationToken);
            if (bytesRead < 5 || System.Text.Encoding.ASCII.GetString(header) != "%PDF-")
                return BadRequest("File content is not a valid PDF.");

            stream.Position = 0; // Reset stream position before saving

            var name = VendorExtractor.ExtractLikelyVendorName(stream);


            // 3. Generate a safe, unique file name and save
            // var uploadsFolder = Path.Combine(_env.ContentRootPath, "Uploads");
            // Directory.CreateDirectory(uploadsFolder);

            // var safeFileName = $"{Guid.NewGuid()}.pdf";
            // var filePath = Path.Combine(uploadsFolder, safeFileName);

            // await using var fileStream = new FileStream(filePath, FileMode.Create);
            // await stream.CopyToAsync(fileStream, cancellationToken);

   

            return Ok(new
            {
                VendorName = "xxx",
                Amount = 100
            });
        }
    }
}