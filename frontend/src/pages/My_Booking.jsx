import React, { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";
import { supabase } from "../api/CreateClient";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaSpinner } from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";

const MyBooking = () => {
  const { session } = UserAuth();
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentQRCode, setCurrentQRCode] = useState(null);

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserBookings();
    }
  }, [session]);

  const fetchUserBookings = async () => {
    try {
      const { data, error } = await supabase
        .from("booking")
        .select("*")
        .eq("email", session.user.email)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMyBookings(data);
    } catch (error) {
      console.error("Error fetching user's bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 text-green-500";
      case "cancelled":
        return "bg-red-500/20 text-red-500";
      case "pending":
        return "bg-yellow-500/20 text-yellow-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  const calculateBookingDays = (checkIn, checkOut) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCardClick = (bookingId, bookingData) => {
    const bookingDays = calculateBookingDays(
      bookingData.checkIn,
      bookingData.checkOut
    );
    setSelectedBookingId(bookingId);
    setCurrentQRCode({
      text: `
      Hello,${session.user.email}
      Here is your booking details:

      Booking ID:
      ${bookingId}
      Room:
      ${bookingData.roomName}
      Check-in:
      ${bookingData.checkIn}
      Check-out:
      ${bookingData.checkOut}
      Status:
      ${bookingData.status}
      Total Cost:
      ₱${bookingData.totalCost}
      Days Booked:
      ${bookingDays}
      `,
      image: bookingData.paymentProofUrl,
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedBookingId(null);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Navbar />
      <div className="py-12 bg-gradient-to-br from-black via-gray-800 to-yellow-900/50 flex-grow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 font-playfair">
              My Bookings
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Here are your current and past bookings.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <FaSpinner className="animate-spin text-white text-2xl" />
              </div>
            ) : myBookings.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                No bookings found.
              </div>
            ) : (
              <div className="space-y-6">
                {myBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white/10 border border-white/10 rounded-xl p-6 cursor-pointer hover:bg-white/20 transition"
                    onClick={() => handleCardClick(booking.id, booking)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-white font-playfair">
                          {booking.roomName}
                        </h3>
                        <p className="text-gray-300 text-sm">
                          {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                          {new Date(booking.checkOut).toLocaleDateString()}
                        </p>
                        <p className="text-gray-300 text-sm">
                          Guests: {booking.guests}
                        </p>
                        {booking.specialRequests && (
                          <p className="text-gray-300 text-sm italic">
                            “{booking.specialRequests}”
                          </p>
                        )}
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-6 text-sm">
                      <div className="bg-white/20 p-3 rounded-lg text-white font-semibold">
                        Total Cost: ₱{booking.totalCost}
                      </div>
                      <div className="bg-white/20 p-3 rounded-lg text-white font-semibold">
                        Phone: {booking.phone}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Modal with GCash Proof */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={handleModalClose}
        >
          <div
            className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-3xl font-bold text-white hover:text-green-400 transition"
              onClick={handleModalClose}
            >
              ×
            </button>

            <div className="flex flex-col items-center">
              <p className="text-white text-center text-2xl font-semibold mb-8 font-playfair">
                Scan for Booking Details
              </p>
              <div className="flex flex-col md:flex-row justify-center items-center gap-10">
                <QRCodeCanvas
                  value={currentQRCode.text}
                  size={300}
                  fgColor="#22c55e" // green-500
                  bgColor="transparent"
                />
                {currentQRCode.image && (
                  <div className="text-center max-w-xs">
                    <p className="text-white font-semibold mb-4">
                      GCash Down Payment Proof
                    </p>
                    <img
                      src={currentQRCode.image}
                      alt="GCash Payment Proof"
                      className="rounded-lg max-h-64 object-contain border border-white/20"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MyBooking;
