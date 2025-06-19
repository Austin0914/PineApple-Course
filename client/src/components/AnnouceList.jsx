import { CiCalendar } from "react-icons/ci";
import { FaAngleRight } from "react-icons/fa6";
import { IconContext } from "react-icons";

function AnnounceList({ announceDate, title, content, onClick }) {
  const truncatedContent =
    content.length > 100 ? `${content.substring(0, 100)}...` : content;

  return (
    <div className="announce-list" onClick={onClick}>
      <div className="announce-list-title">{title}</div>
      <div className="announce-list-content">{truncatedContent}</div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "0.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CiCalendar
            style={{ fill: "var(--font_lightgray)", marginRight: "0.5rem" }}
          />
          <div className="announce-list-date">{announceDate}</div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="announce-list-button">查看詳情</div>

          <FaAngleRight style={{ fill: "var(--style_one)" }} />
        </div>
      </div>
    </div>
  );
}
export default AnnounceList;
