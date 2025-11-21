import Document, { Head, Html, Main, NextScript, type DocumentContext } from "next/document";

type DocumentProps = {
  apiBaseUrl?: string;
};

class NescoDocument extends Document<DocumentProps> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    
    // Get API base URL from environment at runtime (for Heroku compatibility)
    // This allows env vars to be set after build time
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

    return {
      ...initialProps,
      apiBaseUrl,
    };
  }

  override render() {
    const { apiBaseUrl } = this.props;

    return (
      <Html lang="en">
        <Head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.__NEXT_PUBLIC_API_BASE_URL__ = ${JSON.stringify(apiBaseUrl || "")};
              `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default NescoDocument;


