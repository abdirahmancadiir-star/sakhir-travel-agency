import React from "react";

const Home: React.FC = () => {
  return (
    <div className="home-container">

      {/* HERO */}
      <section className="hero-section relative">
        <video className="hero-video" autoPlay muted loop>
          <source src="/assets/hero.mp4" type="video/mp4" />
        </video>

        <div className="hero-overlay" />

        <div className="hero-content">
          <h1>Explore The World In Luxury</h1>
          <p>Premium flights, hotels & travel packages tailored for you</p>

          <div className="hero-buttons">
            <button className="brand-button">Book Now</button>
            <button className="brand-button secondary">Learn More</button>
          </div>
        </div>
      </section>

      {/* AIRLINE MARQUEE (adds richness) */}
      <section className="marquee">
        <div className="marquee-track">
          <span>Emirates</span>
          <span>Qatar Airways</span>
          <span>Turkish Airlines</span>
          <span>Lufthansa</span>
          <span>British Airways</span>
          <span>Emirates</span>
        </div>
      </section>

      {/* STATS (animated feel but simple structure) */}
      <section className="stats-section">
        <div className="brand-card">
          <h2>120+</h2>
          <p>Destinations</p>
        </div>

        <div className="brand-card">
          <h2>5K+</h2>
          <p>Happy Clients</p>
        </div>

        <div className="brand-card">
          <h2>50+</h2>
          <p>Airlines</p>
        </div>
      </section>

      {/* PACKAGES */}
      <section className="section">
        <h2 className="section-title">Popular Packages</h2>

        <div className="grid-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="brand-card package-card">
              <div className="package-image" />

              <h3>Luxury Package {i}</h3>
              <p>
                Experience premium travel with comfort, guidance, and full support.
              </p>

              <button className="brand-button">View Details</button>
            </div>
          ))}
        </div>
      </section>

      {/* LUXURY GALLERY */}
      <section className="section dark-section">
        <h2 className="section-title">Luxury Gallery</h2>

        <div className="gallery-grid">
          {[1,2,3,4,5,6,7,8].map((i) => (
            <div key={i} className="gallery-item" />
          ))}
        </div>
      </section>

      {/* TESTIMONIALS (clean but not empty) */}
      <section className="section">
        <h2 className="section-title">What Clients Say</h2>

        <div className="testimonial-card brand-card">
          <p>
            “Everything was perfectly organized. Flights, hotels and support were top class.”
          </p>
          <span>- Verified Client</span>
        </div>
      </section>

      {/* FAQ (still compact but not ugly) */}
      <section className="section">
        <h2 className="section-title">Frequently Asked Questions</h2>

        <div className="faq-grid">
          <div className="brand-card">How do I book a trip?</div>
          <div className="brand-card">Can I cancel my booking?</div>
          <div className="brand-card">Do you offer support 24/7?</div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="cta-section">
        <h2>Ready to travel with us?</h2>
        <p>Contact our team and start planning your next journey</p>

        <button className="brand-button">Get in Touch</button>
      </section>

      {/* WHATSAPP FLOAT */}
      <a className="whatsapp-float" href="https://wa.me/000000000">
        WhatsApp
      </a>
    </div>
  );
};

export default Home;
