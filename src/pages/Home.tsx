import React from "react";

const Home: React.FC = () => {
  return (
    <div className="home-container">

      {/* HERO (keep strong & premium) */}
      <section className="hero-section">
        <video className="hero-video" autoPlay muted loop>
          <source src="/assets/hero.mp4" type="video/mp4" />
        </video>

        <div className="hero-overlay" />

        <div className="hero-content">
          <h1>Luxury Travel Experience</h1>
          <p>Discover flights, hotels & exclusive packages worldwide</p>

          <div className="hero-actions">
            <button className="brand-button">Explore Packages</button>
            <button className="brand-button secondary">Contact Us</button>
          </div>
        </div>
      </section>

      {/* STATS (this is what makes it feel “alive”) */}
      <section className="stats-section">
        <div className="brand-card">
          <h2>120+</h2>
          <p>Destinations</p>
        </div>

        <div className="brand-card">
          <h2>5000+</h2>
          <p>Happy Clients</p>
        </div>

        <div className="brand-card">
          <h2>50+</h2>
          <p>Airlines</p>
        </div>

        <div className="brand-card">
          <h2>24/7</h2>
          <p>Support</p>
        </div>
      </section>

      {/* AIRLINE MARQUEE (adds luxury feel back) */}
      <section className="marquee-section">
        <div className="marquee-track">
          <span>Emirates</span>
          <span>Qatar Airways</span>
          <span>Turkish Airlines</span>
          <span>Lufthansa</span>
          <span>British Airways</span>
          <span>Emirates</span>
        </div>
      </section>

      {/* PACKAGES (keep clean but not empty) */}
      <section className="section">
        <h2 className="section-title">Popular Packages</h2>

        <div className="grid-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="brand-card package-card">
              <div className="package-image" />

              <h3>Luxury Package {i}</h3>
              <p>
                Premium travel experience with full assistance and exclusive deals.
              </p>

              <button className="brand-button">View Details</button>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY (this is what adds “wow” effect) */}
      <section className="section dark-section">
        <h2 className="section-title">Luxury Gallery</h2>

        <div className="gallery-grid">
          {[1,2,3,4,5,6,7,8].map((i) => (
            <div key={i} className="gallery-item" />
          ))}
        </div>
      </section>

      {/* TESTIMONIALS (not empty, not overdone) */}
      <section className="section">
        <h2 className="section-title">What Clients Say</h2>

        <div className="brand-card testimonial-card">
          <p>
            “One of the best travel experiences I’ve ever had. Everything was smooth and professional.”
          </p>
          <span>- Verified Customer</span>
        </div>
      </section>

      {/* FAQ (clean but not ugly) */}
      <section className="section">
        <h2 className="section-title">FAQ</h2>

        <div className="faq-grid">
          <div className="brand-card">How do I book a trip?</div>
          <div className="brand-card">Can I cancel bookings?</div>
          <div className="brand-card">Do you offer support?</div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="cta-section">
        <h2>Start Your Journey Today</h2>
        <p>Talk to our travel experts and plan your next trip</p>

        <button className="brand-button">Contact Us</button>
      </section>

      {/* WHATSAPP FLOAT */}
      <a className="whatsapp-float" href="https://wa.me/000000000">
        WhatsApp
      </a>
    </div>
  );
};

export default Home;
