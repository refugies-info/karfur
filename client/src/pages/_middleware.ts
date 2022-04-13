import { NextResponse, NextMiddleware } from "next/server";

// Middleware to redirect to the correct locale if none is given
export let middleware: NextMiddleware = (request) => {
  if (
    // Not a file in /public
    !/\.(.*)$/.test(request.nextUrl.pathname) &&
    // Not an api route
    !request.nextUrl.pathname.includes("/api/") &&
    // Uses the default locale
    request.nextUrl.locale === "default"
  ) {
    // Clone the entire current url object
    const newUrl = request.nextUrl.clone();
    // Set the locale to "fr"
    newUrl.locale = "fr";
    // Redirect to the new url
    return NextResponse.redirect(newUrl);
  }
  // Continue to the next middleware
  return undefined;
};
