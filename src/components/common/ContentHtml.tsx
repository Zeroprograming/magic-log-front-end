interface Props {
  value: string;
  needBorder?: boolean;
}
const ContentHtml = ({ value, needBorder = false }: Props) => {
  return (
    <div
      className="dynamic-content-div"
      style={{
        width: '100%',
        overflowWrap: 'break-word',
        color: 'white',
        fontWeight: 'normal',
        border: needBorder ? `2px solid` : 'none',
        lineHeight: '1.1',
        borderBottomLeftRadius: needBorder ? '10px' : '0px',
        borderBottomRightRadius: needBorder ? '10px' : '0px',
      }}
      dangerouslySetInnerHTML={{
        __html: value,
      }}
    />
  );
};

export default ContentHtml;
