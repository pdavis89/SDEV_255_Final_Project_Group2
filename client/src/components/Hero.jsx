export default function Hero({ title, subtitle }) {
  return (
    <div className="hero-container">
      <div className="hero-overlay">
        <h1 className="hero-title">Bookish Systems</h1>
        <div className="hero-divider"></div>
        <p className="hero-subtitle">{subtitle}</p>
        <p className="hero-subtext">
          Welcome to your academic home. Here, you’ll find opportunities to grow, connect, and discover your path. Explore our programs, register for courses, and take the next step toward building the future you envision. 
          
         Our course registration system provides students with a simple and organized way to browse their classes, register for new ones and manage their schedule in a timely manner. By offering clear navigation, essential course details and easy access to tools like calendars and policies, the system helps students stay focused and informed. With streamlined features for exploring options and tracking registered classes it supports a smoother, more efficient academic planning experience for all. 
        </p>
      </div>
    </div>
  );
}