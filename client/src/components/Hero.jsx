export default function Hero({ title, subtitle }) {
  return (
    <div className="hero-container">
      <div className="hero-overlay">

        
        <h1 className="hero-title">{title}</h1>

        
        <div className="hero-divider"></div>

        <p className="hero-subtitle">{subtitle}</p>

        <p className="hero-subtext">
          Welcome to the Course Registration System. This platform allows students to browse available courses, register for classes, and manage their schedules.
          <br />
          Use the navigation above to get started.
        </p>

      </div>
    </div>
  );
}