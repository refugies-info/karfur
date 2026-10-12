import { act, renderHook, waitFor } from "@testing-library/react";
import { logger } from "logger";
import type { ReactNode } from "react";
import { SWRConfig } from "swr";
import { type PaginatedResponse, usePaginatedResults } from "./usePaginatedResults";

jest.mock("logger", () => ({ logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() } }));

interface Params {
  search: string;
}

type Response = PaginatedResponse<string> & { suggestions?: string[] };

const buildPage = (search: string, page: number, pageCount: number): Response => ({
  results: [`${search}-${page}-1`, `${search}-${page}-2`],
  total: 25,
  page,
  pageCount,
  suggestions: [`${search}-suggestion`],
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>{children}</SWRConfig>
);

const renderPaginated = (
  initialParams: Params | null,
  fetchPage: (params: Params, page: number) => Promise<Response>,
) =>
  renderHook(
    ({ params }: { params: Params | null }) =>
      usePaginatedResults<Params, string, Response>({
        cacheKey: "test",
        params,
        fetchPage,
        logLabel: "[test]",
      }),
    { wrapper, initialProps: { params: initialParams } },
  );

describe("usePaginatedResults", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not fetch and reports loading while the params are null", () => {
    const fetchPage = jest.fn();
    const { result } = renderPaginated(null, fetchPage);

    expect(fetchPage).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.results).toEqual([]);
  });

  it("loads the first page and exposes its extra fields", async () => {
    const fetchPage = jest.fn().mockResolvedValue(buildPage("a", 1, 2));
    const { result } = renderPaginated({ search: "a" }, fetchPage);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(fetchPage).toHaveBeenCalledWith({ search: "a" }, 1);
    expect(result.current.results).toEqual(["a-1-1", "a-1-2"]);
    expect(result.current.totalResultsCount).toBe(25);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPageCount).toBe(2);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.firstPage?.suggestions).toEqual(["a-suggestion"]);
  });

  it("appends the next page on loadMore without reloading the first one", async () => {
    const fetchPage = jest
      .fn()
      .mockImplementation(async (params: Params, page: number) =>
        buildPage(params.search, page, 2),
      );
    const { result } = renderPaginated({ search: "a" }, fetchPage);
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.loadMore());
    await waitFor(() => expect(result.current.results).toHaveLength(4));

    expect(result.current.results).toEqual(["a-1-1", "a-1-2", "a-2-1", "a-2-2"]);
    expect(result.current.currentPage).toBe(2);
    expect(fetchPage).toHaveBeenCalledTimes(2);
    expect(fetchPage).toHaveBeenLastCalledWith({ search: "a" }, 2);
  });

  it("does not request a page after the last one", async () => {
    const fetchPage = jest.fn().mockResolvedValue(buildPage("a", 1, 1));
    const { result } = renderPaginated({ search: "a" }, fetchPage);
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.loadMore());
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 20));
    });

    expect(fetchPage).toHaveBeenCalledTimes(1);
    expect(result.current.results).toHaveLength(2);
  });

  it("keeps the previous results and reports loading while a new search loads", async () => {
    let resolveSecondSearch: () => void = () => {};
    const fetchPage = jest.fn().mockImplementation((params: Params, page: number) =>
      params.search === "b"
        ? new Promise<Response>((resolve) => {
            resolveSecondSearch = () => resolve(buildPage("b", page, 1));
          })
        : Promise.resolve(buildPage("a", page, 1)),
    );
    const { result, rerender } = renderPaginated({ search: "a" }, fetchPage);
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    rerender({ params: { search: "b" } });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.results).toEqual(["a-1-1", "a-1-2"]);

    act(() => resolveSecondSearch());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.results).toEqual(["b-1-1", "b-1-2"]);
  });

  it("does not show the previous results when a new search fails", async () => {
    const fetchPage = jest.fn().mockImplementation(async (params: Params, page: number) => {
      if (params.search === "boom") throw new Error("boom");
      return buildPage(params.search, page, 1);
    });
    const { result, rerender } = renderPaginated({ search: "a" }, fetchPage);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.results).toEqual(["a-1-1", "a-1-2"]);

    rerender({ params: { search: "boom" } });
    await waitFor(() => expect(result.current.error).toBe(true));

    expect(result.current.results).toEqual([]);
    expect(result.current.totalResultsCount).toBe(0);
    expect(result.current.isLoading).toBe(false);
  });

  it("keeps the pages already loaded when loading more fails", async () => {
    const fetchPage = jest.fn().mockImplementation(async (params: Params, page: number) => {
      if (page === 2) throw new Error("boom");
      return buildPage(params.search, page, 2);
    });
    const { result } = renderPaginated({ search: "a" }, fetchPage);
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.loadMore());
    await waitFor(() => expect(logger.error).toHaveBeenCalledTimes(1));

    expect(result.current.results).toEqual(["a-1-1", "a-1-2"]);
    expect(result.current.error).toBe(false);
  });

  it("reports the error, logs it and does not retry", async () => {
    const fetchPage = jest.fn().mockRejectedValue(new Error("boom"));
    const { result } = renderPaginated({ search: "a" }, fetchPage);

    await waitFor(() => expect(result.current.error).toBe(true));
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    expect(result.current.isLoading).toBe(false);
    expect(logger.error).toHaveBeenCalledWith("[test] fetching results failed", {
      error: expect.any(Error),
    });
    expect(fetchPage).toHaveBeenCalledTimes(1);
  });
});
