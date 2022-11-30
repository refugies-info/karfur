import { NextResponse, NextMiddleware } from "next/server";

// Middleware to redirect to the correct locale if none is given
export let middleware: NextMiddleware = (request) => {
  if (
    // Not a file in /public
    !/\.(.*)$/.test(request.nextUrl.pathname) &&
    // Not an api route
    !request.nextUrl.pathname.includes("/api/") &&
    !request.nextUrl.pathname.startsWith("/_next/image") &&
    // Uses the default locale
    request.nextUrl.locale === "default"
  ) {
    // Clone the entire current url object
    const newUrl = request.nextUrl.clone();
    // Set the locale to "fr"
    newUrl.locale = "fr";

    if (newUrl.pathname === "/") {
      const url = new URL(request.url);
      return NextResponse.redirect(url.origin + "/fr" + url.search, 308); // fix double redirect for /
    }

    // Redirect to the new url
    return NextResponse.redirect(newUrl, 308);
  }
  // Continue to the next middleware
  return undefined;
};
