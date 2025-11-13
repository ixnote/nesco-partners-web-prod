import Document, { Head, Html, Main, NextScript } from "next/document";

class NescoDocument extends Document {
  override render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default NescoDocument;


