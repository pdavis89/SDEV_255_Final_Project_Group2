// shows the large page banner
export default function Hero({ title, subtitle, subtext }) {
  return (
    <div className="hero-container">
      <div className="hero-overlay">
        <h1 className="hero-title">{title}</h1>
        <div className="hero-divider"></div>
        <p className="hero-subtitle">{subtitle}</p>
        <p className="hero-subtext">
          {subtext ?? (
            <>Welcome to the Course Registration System. This platform allows students to browse available courses, register for classes, and manage your schedules.</>
          )}
        </p>
      </div>
    </div>
  );
}
