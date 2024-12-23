interface Props {
  children: JSX.Element;
}

const NothingLayout = ({ children }: Props) => {
  return <>{children}</>;
};

export default NothingLayout;
