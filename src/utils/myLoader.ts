export const myLoader = ({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) => {
  if (quality) {
    return `${src}?format=auto&quality=${quality}&width=${width}`;
  } else return `${src}?format=auto&width=${width}`;
};
