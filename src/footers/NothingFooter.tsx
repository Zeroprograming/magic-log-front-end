interface Props {
  children: JSX.Element;
}

const NothingFooter = ({ children }: Props) => {
  return <>{children}</>;
};

export default NothingFooter;
