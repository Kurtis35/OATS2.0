import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import BookingForm from './components/BookingForm';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WeddingPortal from './components/WeddingPortal/WeddingPortal';

function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <BookingForm />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/wedding" element={<WeddingPortal />} />
        <Route path="/rockhaven-wedding.html" element={<WeddingPortal />} />
      </Routes>
    </Router>
  );
}

export default App;