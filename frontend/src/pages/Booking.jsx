import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../api/CreateClient";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/datepicker-custom.css";
import { UserAuth } from "../context/AuthContext";


const Booking = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [paymentProof, setPaymentProof] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    checkIn: new Date(),
    checkOut: new Date(new Date().setDate(new Date().getDate() + 1)),
    guests: "",
    specialRequests: "",
  });

  const { session } = UserAuth();

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    const fetchUserEmail = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setFormData((prev) => ({
          ...prev,
          email: session.user.email,
        }));
      }
    };
    fetchUserEmail();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      fetchUnavailableDates(selectedRoom.id);
    }
  }, [selectedRoom]);

  async function fetchRooms() {
    const { data, error } = await supabase.from("room").select("*");
    if (error) {
      console.error("Error fetching rooms:", error);
    } else {
      const sorted = data.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      setRooms(sorted);
    }
  }

  async function fetchUnavailableDates(roomId) {
    const { data, error } = await supabase
      .from("booking")
      .select("checkIn, checkOut")
      .eq("roomId", roomId)
      .neq("status", "cancelled"); 

    if (error) {
      console.error("Error fetching bookings:", error);
    } else {
      const dates = [];
      data.forEach(({ checkIn, checkOut }) => {
        const currentDate = new Date(checkIn);
        const endDate = new Date(checkOut);
        while (currentDate < endDate) {
          dates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
      });
      setUnavailableDates(dates);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setPaymentProof(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoom) return alert("Please select a room first");
    if (!paymentProof) return alert("Please upload proof of GCash payment");

    const fileExt = paymentProof.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `payment_proofs/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("pictures")
      .upload(filePath, paymentProof);

    if (uploadError) {
      console.error("Error uploading payment proof:", uploadError);
      alert("Failed to upload payment proof. Please try again.");
      return;
    }

    const { data: fileUrlData } = supabase.storage
      .from("pictures")
      .getPublicUrl(filePath);

    const bookingData = {
      ...formData,
      roomId: selectedRoom.id,
      roomName: selectedRoom.name,
      totalCost: selectedRoom.cost,
      status: "pending",
      paymentProofUrl: fileUrlData.publicUrl,
    };

    const { error } = await supabase.from("booking").insert([bookingData]);
    if (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking. Please try again.");
    } else {
      alert("Booking submitted successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: formData.email,
        phone: "",
        checkIn: new Date(),
        checkOut: new Date(new Date().setDate(new Date().getDate() + 1)),
        guests: "",
        specialRequests: "",
      });
      setSelectedRoom(null);
      setUnavailableDates([]);
      setPaymentProof(null);
    }
  };

  const getDayClassName = (date) => {
    const isBooked = unavailableDates.some(
      (d) =>
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
    );
    return isBooked ? "booked-date" : "available-date";
  };

  return (
    <div className="bg-gray-700 text-white">
      <Navbar />
      <div className="bg-gradient-to-b from-black/90 via-orange-1100/90 to-yellow-700/90 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-2">
            Book Your Stay
          </h1>
          <h2 className="text-gray-300 text-center mb-8 text-lg">
            Hello, {session?.user?.email}
          </h2>
          <p className="text-gray-300 text-center mb-8">
            Select your room and provide your details
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Available Rooms</h2>
              <div className="grid gap-4">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedRoom?.id === room.id
                        ? "bg-white/25 border-white/40"
                        : "bg-white/5 border-white/20 hover:bg-white/20"
                    }`}
                    onClick={() => setSelectedRoom(room)}
                  >
                    <div className="flex gap-4">
                      <img
                        src={room.image}
                        alt={room.name}
                        className="w-32 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-1">
                          {room.name}
                        </h3>
                        <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                          {room.about}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-300">
                            {room.size} sqm • {room.occupancy} guests
                          </div>
                          <div className="font-bold text-red-500">
                            ₱{room.cost}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 rounded-xl border border-white/20 p-6">
              <h2 className="text-2xl font-semibold mb-6">Booking Details</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="firstName" className="text-white text-sm">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Roystone"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white w-full"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="lastName" className="text-white text-sm">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Obmana"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white w-full"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="email" className="text-white text-sm">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    readOnly
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="phone" className="text-white text-sm">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="09123456789"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="checkIn" className="text-white text-sm">
                      Check-In
                    </label>
                    <DatePicker
                      id="checkIn"
                      selected={formData.checkIn}
                      onChange={(date) =>
                        setFormData((prev) => ({ ...prev, checkIn: date }))
                      }
                      minDate={new Date()}
                      excludeDates={unavailableDates}
                      dayClassName={getDayClassName}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="checkOut" className="text-white text-sm">
                      Check-Out
                    </label>
                    <DatePicker
                      id="checkOut"
                      selected={formData.checkOut}
                      onChange={(date) =>
                        setFormData((prev) => ({ ...prev, checkOut: date }))
                      }
                      minDate={formData.checkIn}
                      excludeDates={unavailableDates}
                      dayClassName={getDayClassName}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="guests" className="text-white text-sm">
                    Number of Guests
                  </label>
                  <input
                    id="guests"
                    name="guests"
                    type="number"
                    placeholder="2"
                    value={formData.guests}
                    onChange={handleInputChange}
                    min="1"
                    max={selectedRoom?.occupancy}
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="specialRequests"
                    className="text-white text-sm"
                  >
                    Special Requests
                  </label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    placeholder="Extra pillows, extra blankets, etc."
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                  />
                </div>

                {selectedRoom && (
                  <>
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <p>
                        Selected Room: <strong>{selectedRoom.name}</strong>
                      </p>
                      <p>
                        Total Cost: <strong>₱{selectedRoom.cost}</strong>
                      </p>
                      <p>
                        50% Downpayment:{" "}
                        <strong>₱{(selectedRoom.cost * 0.5).toFixed(2)}</strong>
                      </p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-center mb-2">Send GCash Payment to:</p>
                      <img
                        src="/src/assets/Freddiemaximo.jpg"
                        alt="GCash QR Code"
                        className="w-40 h-40 object-contain mx-auto"
                      />
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <label className="block mb-2 text-sm font-medium text-gray-300">
                        Upload GCash Down Payment Proof
                      </label>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleFileChange}
                        required
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white file:bg-white/10 file:text-white file:border-none file:rounded file:px-3 file:py-1"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200"
                >
                  Book Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Booking;
