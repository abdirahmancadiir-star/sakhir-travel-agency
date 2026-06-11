import React from "react";
// import TravelAssistant from "../components/TravelAssistant";
// import WhatsAppButton from "../components/WhatsAppButton";
// import TestimonialsSlider from "../components/TestimonialsSlider";

const Home: React.FC = () => {
  return (
    <div className="home-container">

      {/* HERO SECTION */}
      <section className="hero-section relative h-screen flex items-center justify-center text-center text-white">
        <video
          className="absolute w-full h-full object-cover"
          autoPlay
          muted
          loop
        >
          <source src="/assets/hero-video.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10">
          <h1 className="text-5xl font-bold">Discover Luxury Travel</h1>
          <p className="mt-4 text-lg">Experience the world in comfort & style</p>
          <button className="brand-button mt-6">Explore Packages</button>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="stats-section py-16 grid grid-cols-2 md:grid-cols-4 text-center">
        <div>
          <h2 className="text-3xl font-bold">120+</h2>
          <p>Destinations</p>
        </div>
        <div>
          <h2 className="text-3xl font-bold">5000+</h2>
          <p>Happy Clients</p>
        </div>
        <div>
          <h2 className="text-3xl font-bold">50+</h2>
          <p>Airlines</p>
        </div>
        <div>
          <h2 className="text-3xl font-bold">24/7</h2>
          <p>Support</p>
        </div>
      </section>

      {/* PACKAGES SECTION */}
      <section className="packages-section py-16">
        <h2 className="text-center text-3xl font-bold mb-8">
          Popular Packages
        </h2>

        <div className="grid md:grid-cols-3 gap-6 px-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="brand-card p-4">
              <div className="h-40 bg-gray-200 rounded"></div>
              <h3 className="mt-4 font-semibold">Luxury Package {item}</h3>
              <p className="text-sm text-gray-500">
                Short description of travel package...
              </p>
              <button className="brand-button mt-3">View Details</button>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section className="gallery-section py-16">
        <h2 className="text-center text-3xl font-bold mb-8">
          Luxury Gallery
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((img) => (
            <div key={img} className="h-40 bg-gray-300 rounded"></div>
          ))}
        </div>
      </section>

      {/* AIRLINE MARQUEE */}
      <section className="py-10 overflow-hidden whitespace-nowrap">
        <div className="flex gap-10 animate-scroll">
          <span>Emirates</span>
          <span>Qatar Airways</span>
          <span>Turkish Airlines</span>
          <span>Lufthansa</span>
          <span>British Airways</span>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold mb-8">What Clients Say</h2>

        {/* Replace with your slider component */}
        <div className="max-w-3xl mx-auto">
          <p className="italic">
            "Amazing experience, everything was perfectly organized!"
          </p>
          <p className="mt-4 font-semibold">— Happy Customer</p>
        </div>
      </section>

      {/* FAQ SECTION (SIMPLIFIED) */}
      <section className="py-16 px-6">
        <h2 className="text-center text-3xl font-bold mb-6">FAQ</h2>

        <div className="max-w-2xl mx-auto space-y-4">
          <div className="brand-card p-4">How do I book a trip?</div>
          <div className="brand-card p-4">Can I cancel bookings?</div>
          <div className="brand-card p-4">Do you offer refunds?</div>
        </div>
      </section>

      {/* NEWSLETTER (MINIMAL) */}
      <section className="py-16 text-center">
        <h2 className="text-2xl font-bold">Stay Updated</h2>
        <input
          className="mt-4 p-2 border"
          placeholder="Enter your email"
        />
        <button className="brand-button ml-2">Subscribe</button>
      </section>

      {/* CONTACT */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold">Contact Us</h2>
        <p className="mt-2">We are available 24/7 for support</p>
        <button className="brand-button mt-4">Get in Touch</button>
      </section>

      {/* COMPONENTS (OPTIONAL) */}
      {/* <TravelAssistant /> */}
      {/* <WhatsAppButton /> */}

      {/* FLOATING WHATSAPP (if not component) */}
      <a
        href="https://wa.me/000000000"
        className="fixed bottom-5 right-5 bg-green-500 text-white p-4 rounded-full shadow-lg"
      >
        WhatsApp
      </a>
    </div>
  );
};

export default Home;
