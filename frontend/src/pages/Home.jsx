import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";  

const Home = () => {
  const { session, roles } = UserAuth();  
  const isLoggedIn = !!session;  
  const isUser = isLoggedIn && roles.includes("user");  
  const isAdmin = isLoggedIn && roles.includes("admin");  

  let bookLink = "/signin";
  if (isUser) {
    bookLink = "/booking";
  } else if (isAdmin) {
    bookLink = "/dashboard"; 
  }

  return (
    <div className="bg-gray-700 text-white min-h-screen isolate">
      <Navbar />

      {/* Main Section */}
      <div
        className="h-[90vh] bg-cover bg-top flex items-center justify-center text-center px-4 relative"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/src/assets/bgpic.jpg')",
        }}
      >
        <div className="max-w-3xl z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5 text-shadow font-playfair">
            Hotel Booking System
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-shadow font-light tracking-wide max-w-2xl mx-auto">
            Enjoy stunning beachfront views, cozy accommodations, and exceptional hospitality
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to={bookLink}>
              <button className="px-8 py-4 text-lg bg-green-500 text-white rounded font-semibold tracking-wider uppercase transition-all duration-300 hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-lg">
                Book Your Stay
              </button>
            </Link>
            <Link to="/rooms">
              <button className="px-8 py-4 text-lg bg-green-500 text-white rounded font-semibold tracking-wider uppercase transition-all duration-300 hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-lg">
                Rooms
              </button>
            </Link>
            <Link to="/contact">
              <button className="px-8 py-4 text-lg bg-green-500 text-white rounded font-semibold tracking-wider uppercase transition-all duration-300 hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-lg">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-20 px-6 md:px-20 bg-gradient-to-b from-black/90 via-blue-900/90 to-yellow-700/90">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center relative z-10">
          <div>
            <img
              src="/src/assets/picture1.jpg"
              alt="Elpise Inn Hostel"
              className="rounded-2xl shadow-lg object-cover w-full h-72 md:h-96"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4 font-playfair">
              About Hotel Booking System
            </h2>
            <p className="text-lg leading-relaxed mb-4">
              Nestled in the heart of "Your Location" offers a tranquil escape just steps from the sea. Whether you're planning a romantic getaway, family retreat, or solo adventure, we provide a warm and peaceful atmosphere with all the comforts you need.
            </p>
            <p className="text-base leading-relaxed">
              From breathtaking sunsets to crystal-clear waters, our beachfront location invites you to slow down, unwind, and savor every moment.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
