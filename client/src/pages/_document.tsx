import Document, { Html, Head, Main, NextScript, DocumentContext } from "next/document"

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#000000" />
          {process.env.NEXT_PUBLIC_REACT_APP_ENV !== "production" &&
            <meta name="robots" content="noindex, nofollow" />
          }
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
