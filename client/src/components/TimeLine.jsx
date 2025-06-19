import "./TimeLine.css";

function TimeLine() {
  const data = [
    {
      index: 0,
      startDate: "6/9",
      endDate: "6/13",
      description: "第一階段選課",
    },
    {
      index: 1,
      startDate: "9/8",
      endDate: "9/12",
      description: "第二階段選課-篩選",
    },
    {
      index: 2,
      startDate: "9/13",
      endDate: "9/18",
      description: "第二階段選課-加選",
    },
  ];

  function timeLineItem(index, startDate, endDate, description) {
    return (
      <div className="timeline-item">
        <div
          className={`circle ${index === 1 ? "blinking-element" : ""}`}
        ></div>
        <h3>
          {startDate} - {endDate}
        </h3>
        <p>{description}</p>
      </div>
    );
  }

  return (
    <>
      <div className="function-card timeline">
        <h1>114選年度選課時間軸</h1>
        <div className="timeline-line"></div>
        <div className="timeline-box">
          {data.map((item, index) => (
            <div key={index} className="timeline-item">
              {timeLineItem(
                index,
                item.startDate,
                item.endDate,
                item.description
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default TimeLine;
