import React from "react";
// import TravelAssistant from "../components/TravelAssistant";
// import TestimonialsSlider from "../components/TestimonialsSlider";

const Home: React.FC = () => {
  return (
    <div className="home">

      {/* HERO */}
      <section className="hero relative">
        <div className="hero-overlay" />

        <video className="hero-video" autoPlay muted loop>
          <source src="/assets/hero.mp4" type="video/mp4" />
        </video>

        <div className="hero-content">
          <h1>Luxury Travel Experience</h1>
          <p>Book flights, hotels & packages in one place</p>

          <div className="hero-actions">
            <button className="brand-button">Explore</button>
            <button className="brand-button secondary">Contact</button>
          </div>
        </div>
      </section>

      {/* QUICK STATS (simple, not flashy) */}
      <section className="stats">
        <div className="brand-card">120+ Destinations</div>
        <div className="brand-card">5000+ Clients</div>
        <div className="brand-card">50+ Airlines</div>
      </section>

      {/* PACKAGES */}
      <section className="section">
        <h2 className="section-title">Popular Packages</h2>

        <div className="grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="brand-card package-card">
              <div className="img-placeholder" />
              <h3>Travel Package {i}</h3>
              <p>Premium travel experience with full support.</p>
              <button className="brand-button">View</button>
            </div>
          ))}
        </div>
      </section>

      {/* LUXURY GALLERY */}
      <section className="section dark">
        <h2 className="section-title">Luxury Gallery</h2>

        <div className="gallery">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="gallery-item" />
          ))}
        </div>
      </section>

      {/* TESTIMONIALS (simple placeholder) */}
      <section className="section">
        <h2 className="section-title">What Clients Say</h2>

        <div className="brand-card testimonial">
          <p>"Best travel service I’ve ever used. Smooth and fast booking."</p>
          <span>- Happy Client</span>
        </div>
      </section>

      {/* FAQ (compact) */}
      <section className="section">
        <h2 className="section-title">FAQ</h2>

        <div className="faq">
          <div className="brand-card">How do I book?</div>
          <div className="brand-card">Can I cancel?</div>
          <div className="brand-card">Do you offer support?</div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section">
        <h2 className="section-title">Contact</h2>

        <button className="brand-button">Get in Touch</button>
      </section>

      {/* FLOATING WHATSAPP */}
      <a className="whatsapp-float" href="https://wa.me/000000000">
        WhatsApp
      </a>

      {/* <TravelAssistant /> */}
      {/* <TestimonialsSlider /> */}
    </div>
  );
};

export default Home;
