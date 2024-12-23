import HeadComponent from 'next/head';

interface Props {
  title?: string;
  url?: string;
  image?: string;
  description?: string;
  user?: string;
  favicon?: string;
}

const Head = ({
  title = 'Web title',
  url,
  image,
  description,
  user = 'web user title',
  favicon,
}: Props) => {
  const titleDefault = `${title}`;
  const imageDefault = image ?? '';

  return (
    <HeadComponent>
      <title key="custom-title">{titleDefault}</title>
      <link rel="shortcut icon" href={favicon ?? '/favicon.ico'} />
      <meta name="description" content={description ?? 'Web description'} />

      {/* FACEBOOK & OTHER SITES */}
      <meta property="og:title" content={titleDefault} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageDefault} />
      <meta property="og:url" content={url} />
      {/* TWITTER CARD */}
      <meta name="twitter:title" content={titleDefault} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageDefault} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={`@${user}`} />
      <meta name="twitter:creator" content={`@${user}`} />
    </HeadComponent>
  );
};

export default Head;
