﻿namespace AsimKiosk.Contracts.Common
{
    /// <summary>
    /// Represents the generic paged list.
    /// </summary>
    /// <typeparam name="T">The type of list.</typeparam>
    public sealed class PagedList<T>
    {
        public PagedList(IEnumerable<T> items, int totalCount, int page, int pageSize)
        {
            Page = page;
            PageSize = pageSize;
            Items = items.ToList();
            TotalCount = totalCount;
        }
        /// <summary>
        /// Gets the current page.
        /// </summary>
        public int Page { get; }

        /// <summary>
        /// Gets the page size. The maximum page size is 100.
        /// </summary>
        public int PageSize { get; }

        /// <summary>
        /// Gets the total number of items.
        /// </summary>
        public int TotalCount { get; }
        /// <summary>
        /// Gets the total number of pages.
        /// </summary>
        public int TotalPage => (int)Math.Ceiling(TotalCount / (double)PageSize);

        /// <summary>
        /// Gets the flag indicating whether the next page exists.
        /// </summary>
        public bool HasNextPage => Page * PageSize < TotalCount;

        /// <summary>
        /// Gets the flag indicating whether the previous page exists.
        /// </summary>
        public bool HasPreviousPage => Page > 1;

        /// <summary>
        /// Gets the items.
        /// </summary>
        public IReadOnlyCollection<T> Items { get; }
    }
}
