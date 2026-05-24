import "./SplitEnding.css";

interface Props {
  baseUrl: string;
}

export function SplitEnding({ baseUrl }: Props) {
  return (
    <div className="se-root">
      <img className="se-bg" src={`${baseUrl}images/cover.jpg`} alt="" />
      <div className="se-overlay" />
      <div className="se-end">END</div>
    </div>
  );
}
