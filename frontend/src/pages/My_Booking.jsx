import React, { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";
import { supabase } from "../api/CreateClient";
import Navbar from "../components/Navbar";
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
// console.log(session)
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
    <div className="min-h-screen bg-gradient-to-b from-black/90 via-orange-1100/90 to-yellow-700/90">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-1">My Bookings</h1>
          <p className="text-gray-300">
            Here are your current and past bookings.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <FaSpinner className="animate-spin text-white text-2xl" />
            </div>
          ) : myBookings.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              No bookings found.
            </div>
          ) : (
            <div className="space-y-4">
              {myBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 cursor-pointer"
                  onClick={() => handleCardClick(booking.id, booking)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
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
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-4">
                    <div className="bg-white/10 p-3 rounded-lg text-sm text-white">
                      Total Cost:{" "}
                      <span className="font-semibold">
                        ₱{booking.totalCost}
                      </span>
                    </div>
                    <div className="bg-white/10 p-3 rounded-lg text-sm text-white">
                      Phone:{" "}
                      <span className="font-semibold">{booking.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* QR Modal with GCash Proof */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gradient-to-b from-black/90 via-orange-1100/90 to-yellow-700/90 flex items-center justify-center z-50"
          onClick={handleModalClose}
        >
          <div
            className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-xl font-bold text-white"
              onClick={handleModalClose}
            >
              ×
            </button>

            <div className="flex flex-col items-center">
              <p className="text-white text-center text-2xl font-semibold mb-6">
                Scan for Booking Details
              </p>
              <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                <QRCodeCanvas
                  value={currentQRCode.text}
                  size={300}
                  fgColor="#facc15"
                  bgColor="transparent"
                />
                {currentQRCode.image && (
                  <div className="text-center">
                    <p className="text-white font-semibold mb-2">
                      GCash Down Payment Proof
                    </p>
                    <img
                      src={currentQRCode.image}
                      alt="GCash Payment Proof"
                      className="rounded-lg max-h-64 object-contain border"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBooking;
