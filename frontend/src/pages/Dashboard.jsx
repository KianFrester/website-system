import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { UserAuth } from "../context/AuthContext";
import { supabase } from "../api/CreateClient";
import {
  FaCheck,
  FaTimes,
  FaSpinner,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

const Dashboard = () => {
  const { session } = UserAuth();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    const channel = supabase
      .channel("booking_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "booking",
        },
        (payload) => {
          console.log("Received realtime update:", payload);
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchBookings();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter, dateFilter]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from("booking")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookings(data);
      setFilteredBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.firstName.toLowerCase().includes(searchLower) ||
          booking.lastName.toLowerCase().includes(searchLower) ||
          booking.roomName.toLowerCase().includes(searchLower) ||
          booking.email.toLowerCase().includes(searchLower)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (dateFilter) {
      case "today":
        filtered = filtered.filter((booking) => {
          const checkIn = new Date(booking.checkIn);
          return checkIn.toDateString() === today.toDateString();
        });
        break;
      case "upcoming":
        filtered = filtered.filter((booking) => {
          const checkIn = new Date(booking.checkIn);
          return checkIn > today;
        });
        break;
      case "past":
        filtered = filtered.filter((booking) => {
          const checkOut = new Date(booking.checkOut);
          return checkOut < today;
        });
        break;
      default:
        break;
    }

    setFilteredBookings(filtered);
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const { data, error } = await supabase
        .from("booking")
        .update({ status: newStatus })
        .eq("id", bookingId)
        .select();

      if (error) throw error;

      const updated = data[0];
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
      setSelectedBooking((prev) =>
        prev && prev.id === bookingId ? { ...prev, status: newStatus } : prev
      );

      alert(
        `Booking ${
          newStatus === "confirmed" ? "confirmed" : "cancelled"
        } successfully`
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
      alert("Failed to update booking status.");
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

  // const handleDeleteBooking = async (bookingId) => {
  //   const confirm = window.confirm(
  //     "Are you sure you want to delete this booking?"
  //   );
  //   if (!confirm) return;

  //   try {
  //     const { error } = await supabase
  //       .from("booking")
  //       .delete()
  //       .eq("id", bookingId);

  //     if (error) throw error;

  //     alert("Booking deleted successfully.");
  //     fetchBookings();
  //   } catch (error) {
  //     console.error("Delete error:", error);
  //     alert("Failed to delete booking.");
  //   }
  // };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black/90 via-orange-1100/90 to-yellow-700/90">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-300">Welcome back, {session?.user?.email}</p>
        </div>

        {/* Bookings Section */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-2xl font-semibold text-white">
              Booking Management
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.5rem center",
                  backgroundSize: "1.5em 1.5em",
                  paddingRight: "2.5rem",
                }}
              >
                <option value="all" className="bg-gray-800 text-white">
                  All Status
                </option>
                <option value="pending" className="bg-gray-800 text-white">
                  Pending
                </option>
                <option value="confirmed" className="bg-gray-800 text-white">
                  Confirmed
                </option>
                <option value="cancelled" className="bg-gray-800 text-white">
                  Cancelled
                </option>
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.5rem center",
                  backgroundSize: "1.5em 1.5em",
                  paddingRight: "2.5rem",
                }}
              >
                <option value="all" className="bg-gray-800 text-white">
                  All Dates
                </option>
                <option value="today" className="bg-gray-800 text-white">
                  Today
                </option>
                <option value="upcoming" className="bg-gray-800 text-white">
                  Upcoming
                </option>
                <option value="past" className="bg-gray-800 text-white">
                  Past
                </option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <FaSpinner className="animate-spin text-2xl text-white" />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No bookings found
                </div>
              ) : (
                filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all cursor-pointer"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <div className="flex  justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {booking.roomName}
                        </h3>
                        <p className="text-gray-300 text-sm">
                          {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                          {new Date(booking.checkOut).toLocaleDateString()}
                        </p>
                        <p className="text-gray-300 text-sm">
                          Guest: {booking.firstName} {booking.lastName}
                        </p>
                        <p className="text-gray-500 text-s">
                          Booked on:{" "}
                          {new Date(booking.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {selectedBooking && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-white">
                  Booking Details
                </h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Room</p>
                    <p className="text-white font-semibold">
                      {selectedBooking.roomName}
                    </p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Status</p>
                    <p
                      className={`font-semibold ${getStatusColor(
                        selectedBooking.status
                      )}`}
                    >
                      {selectedBooking.status}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Check-in</p>
                    <p className="text-white">
                      {new Date(selectedBooking.checkIn).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Check-out</p>
                    <p className="text-white">
                      {new Date(selectedBooking.checkOut).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-sm text-gray-400">Guest Information</p>
                  <p className="text-white">
                    Guest Name: {selectedBooking.firstName}{" "}
                    {selectedBooking.lastName}
                  </p>
                  <p className="text-gray-300">
                    Email: {selectedBooking.email}
                  </p>
                  <p className="text-gray-300">
                    Phone: {selectedBooking.phone}
                  </p>
                  <p className="text-gray-300">
                    Guests: {selectedBooking.guests}
                  </p>
                </div>

                {selectedBooking.specialRequests && (
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Special Requests</p>
                    <p className="text-white">
                      {selectedBooking.specialRequests}
                    </p>
                  </div>
                )}
                {selectedBooking.paymentProofUrl && (
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Payment Proof</p>
                    <img
                      src={selectedBooking.paymentProofUrl}
                      alt="GCash Payment Proof"
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                )}

                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-sm text-gray-400">Total Cost</p>
                  <p className="text-red-500 font-bold text-xl">
                    ₱{selectedBooking.totalCost}
                  </p>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedBooking.id, "confirmed")
                    }
                    className={`flex-1 font-bold py-3 px-4 rounded-xl transition-colors ${
                      selectedBooking.status !== "pending"
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                    disabled={selectedBooking.status !== "pending"}
                  >
                    Confirm Booking
                  </button>

                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedBooking.id, "cancelled")
                    }
                    className={`flex-1 font-bold py-3 px-4 rounded-xl transition-colors ${
                      selectedBooking.status !== "pending"
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                    disabled={selectedBooking.status !== "pending"}
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
