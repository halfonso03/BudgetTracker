using System;

namespace Application.PaginationHelpers;

public class PagedList<T> : List<T>
{
    public PaginationMetadata Metadata { get; set; }

    public PagedList(List<T> items, int count, int pageNumber, int pageSize)
    {

        Metadata = new PaginationMetadata
        {
            TotalCount = count,
            PageSize = pageSize,
            CurrentPage = pageNumber,
            TotalPages = (int)Math.Ceiling(count / (double)pageSize)
        };

        AddRange(items);
    }

    public static PagedList<T> ToPagedList(IQueryable<T> query, int pageNumber, int pageSize)
    {
        var count = query.Count();
        var items = query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
        return new PagedList<T>(items, count, pageNumber, pageSize);
    }
}
