import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300&family=Nunito:wght@200;300;400;500;600;700;800;900;1000&family=Play:wght@700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body className="bg-white text-black dark:border-gray-500 dark:bg-[#1e272e] dark:text-white">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
