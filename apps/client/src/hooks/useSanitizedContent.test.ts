import { renderHook } from "@testing-library/react";
import { SHORT_TEXT_ALLOWED_TAGS, useSanitizedContent } from "./useSanitizedContent";

describe("useSanitizedContent", () => {
  it("keeps DOMPurify's default allowlist when no tags are specified", () => {
    const { result } = renderHook(() =>
      useSanitizedContent("<h2>Title</h2><p>Body <b>text</b></p>"),
    );
    expect(result.current).toEqual("<h2>Title</h2><p>Body <b>text</b></p>");
  });

  it("strips tags outside the given allowlist but keeps allowed ones", () => {
    const { result } = renderHook(() =>
      useSanitizedContent(
        "<h2>Title</h2><p>Body <b>bold</b> and <script>evil()</script></p>",
        SHORT_TEXT_ALLOWED_TAGS,
      ),
    );
    expect(result.current).toEqual("Title<p>Body <b>bold</b> and </p>");
  });

  it("keeps list markup allowed for short fields", () => {
    const { result } = renderHook(() =>
      useSanitizedContent(
        '<ul><li>One</li><li>Two</li></ul><a href="https://evil.example">click</a>',
        SHORT_TEXT_ALLOWED_TAGS,
      ),
    );
    expect(result.current).toEqual("<ul><li>One</li><li>Two</li></ul>click");
  });

  it("returns an empty string for undefined content", () => {
    const { result } = renderHook(() => useSanitizedContent(undefined, SHORT_TEXT_ALLOWED_TAGS));
    expect(result.current).toEqual("");
  });
});
