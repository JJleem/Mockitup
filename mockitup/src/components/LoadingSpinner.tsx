// Props 타입 정의
type SpinnerProps = {
  title?: string; // 'purple' 또는 다른 값 (기본값 rainbow)
  iconWidth?: number;
  iconHeight?: number;
};

const LoadingSpinner = ({ title }: SpinnerProps) => {
  const isPurple = title === "purple";
  const gradientId = isPurple
    ? "spinner-gradient-purple"
    : "spinner-gradient-rainbow";

  return (
    // 🔥 [수정] CSS 파일의 .elastic-spinner-wrapper 와 이름 일치시킴
    <div className="elastic-spinner-wrapper">
      {/* 1. 가운데 아이콘 (CSS 애니메이션을 위해 먼저 배치하거나 z-index 확인 필요) */}
      {/* <img
        src="/mockitup.png"
        alt="Loading..."
        className="center-icon" // CSS의 .center-icon 스타일 적용
        style={{
          width: `${iconWidth}px`,
          height: `${iconHeight}px`,
        }}
      /> */}

      {/* 2. 회전하는 SVG */}
      <svg className="spinner-svg" viewBox="25 25 50 50">
        <defs>
          {/* 레인보우 그라데이션 */}
          <linearGradient
            id="spinner-gradient-rainbow"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#fdfdfd" />
            <stop offset="25%" stopColor="#6cc4e7" />
            <stop offset="50%" stopColor="#abcdff" />
            <stop offset="75%" stopColor="#a7dfff" />
            <stop offset="100%" stopColor="#3463e6" />
          </linearGradient>

          {/* 퍼플 그라데이션 */}
          <linearGradient
            id="spinner-gradient-purple"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#8f33d8" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>
        </defs>

        {/* 실제로 움직이는 원 */}
        <circle
          className="spinner-circle" // CSS의 .spinner-circle 스타일 적용
          cx="50"
          cy="50"
          r="20"
          style={{ stroke: `url(#${gradientId})` }}
        />
      </svg>
    </div>
  );
};

export default LoadingSpinner;
