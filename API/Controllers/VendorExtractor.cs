using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UglyToad.PdfPig;

namespace API.Controllers
{
    public class VendorExtractor
    {
        public static string? ExtractLikelyVendorName(Stream pdfStream)
        {
            using var document = PdfDocument.Open(pdfStream);
            var firstPage = document.GetPage(1);
            var words = firstPage.GetWords().ToList();

            if (words.Count == 0) return null;

            // 1. Filter to words in the top 20% of the page
            double topThreshold = firstPage.Height * 0.80;
            var headerWords = words
                .Where(w => w.BoundingBox.Bottom >= topThreshold)
                .ToList();

            if (headerWords.Count == 0) return null;

            // 2. Find the largest font height in the header (often the company logo/name)
            double maxFontHeight = headerWords.Max(w => w.BoundingBox.Height);

            // 3. Group words near that max height on the same line (within 2pt Y tolerance)
            var primaryHeaderWords = headerWords
                .Where(w => Math.Abs(w.BoundingBox.Height - maxFontHeight) <= 2.0)
                .OrderByDescending(w => w.BoundingBox.Bottom) // Top to bottom
                .ThenBy(w => w.BoundingBox.Left)            // Left to right
                .ToList();

            // Take the first line of large text
            double firstLineY = primaryHeaderWords.First().BoundingBox.Bottom;
            var vendorWords = primaryHeaderWords
                .Where(w => Math.Abs(w.BoundingBox.Bottom - firstLineY) <= 3.0)
                .OrderBy(w => w.BoundingBox.Left)
                .Select(w => w.Text);

            return string.Join(" ", vendorWords);
        }
    }
}