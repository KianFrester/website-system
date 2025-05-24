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
      downpayment: selectedRoom.cost * 0.5,
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

  const [footer, setFooter] = useState("");

  useEffect(() => {
    fetchFooter();
  }, []);

  const fetchFooter = async () => {
    try {
      const { data } = await supabase.from("footer").select("*").single();
      setFooter(data);
    } catch (error) {
      console.log(error);
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
    <div className="bg-gray-900 text-gray-100 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-12 px-6 sm:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-extrabold text-center mb-4 tracking-tight text-green-400">
            Book Your Stay
          </h1>
          <h2 className="text-center text-gray-400 mb-10 text-lg font-medium">
            Hello,{" "}
            <span className="text-green-400">{session?.user?.email}</span>
          </h2>
          <p className="text-center text-gray-400 mb-12 text-base max-w-xl mx-auto">
            Select your room and provide your details below to secure your
            booking.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Rooms List */}
            <section className="space-y-6">
              <h2 className="text-3xl font-semibold mb-6 text-green-300 border-b border-green-600 pb-2">
                Available Rooms
              </h2>
              <div className="grid gap-5">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className={`flex justify-between cursor-pointer rounded-lg p-5 border transition-shadow duration-300 ${
                      selectedRoom?.id === room.id
                        ? "bg-green-900 border-green-500 shadow-lg"
                        : "bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-green-400"
                    }`}
                    onClick={() => setSelectedRoom(room)}
                  >
                    <div className="flex">
                      <img
                        src={room.image}
                        alt={room.name}
                        className="w-36 h-28 object-cover rounded-md shadow-md flex-shrink-0"
                      />
                      <div className="ml-5 flex flex-col justify-between">
                        <div>
                          <h3 className="text-2xl font-semibold text-green-300">
                            {room.name}
                          </h3>
                          <p className="text-gray-400 mt-1 text-sm line-clamp-2 max-w-md">
                            {room.about}
                          </p>
                        </div>
                        <div className="mt-3 text-gray-400 text-sm font-medium">
                          {room.size} sqm • {room.occupancy} guests
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center pl-6">
                      <span className="text-green-400 font-bold text-xl whitespace-nowrap">
                        ₱{room.cost}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Booking Form */}
            <section className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700">
              <h2 className="text-3xl font-semibold mb-8 text-green-300 border-b border-green-600 pb-3">
                Booking Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block mb-2 text-sm font-medium text-gray-300"
                    >
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
                      className="w-full bg-gray-900 border border-gray-600 rounded-md px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block mb-2 text-sm font-medium text-gray-300"
                    >
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
                      className="w-full bg-gray-900 border border-gray-600 rounded-md px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-300"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    readOnly
                    className="w-full bg-gray-900 border border-gray-600 rounded-md px-4 py-2 text-gray-100 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block mb-2 text-sm font-medium text-gray-300"
                  >
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
                    className="w-full bg-gray-900 border border-gray-600 rounded-md px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="checkIn"
                      className="block mb-2 text-sm font-medium text-gray-300"
                    >
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
                      className="w-full bg-gray-900 border border-gray-600 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="checkOut"
                      className="block mb-2 text-sm font-medium text-gray-300"
                    >
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
                      className="w-full bg-gray-900 border border-gray-600 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="guests"
                    className="block mb-2 text-sm font-medium text-gray-300"
                  >
                    Number of Guests
                  </label>
                  <input
                    id="guests"
                    name="guests"
                    type="number"
                    min={1}
                    value={formData.guests}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-900 border border-gray-600 rounded-md px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="specialRequests"
                    className="block mb-2 text-sm font-medium text-gray-300"
                  >
                    Special Requests (Optional)
                  </label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    rows={3}
                    placeholder="Any preferences or needs?"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-600 rounded-md px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition resize-none"
                  />
                </div>

                {selectedRoom ? (
                  <div className="mb-6 bg-gray-900 p-4 rounded-md border border-green-600 text-green-300">
                    <h3 className="text-xl font-semibold mb-2">
                      Selected Room
                    </h3>
                    <p>
                      <strong>Name:</strong> {selectedRoom.name}
                    </p>
                    <p>
                      <strong>Total Cost:</strong> ₱
                      {selectedRoom.cost.toFixed(2)}
                    </p>
                    <p>
                      <strong>Downpayment (50%):</strong> ₱
                      {(selectedRoom.cost * 0.5).toFixed(2)}
                    </p>
                  </div>
                ) : (
                  <p className="mb-6 text-gray-400 italic">
                    Please select a room.
                  </p>
                )}

                <div className="mb-6">
                  <h3 className="text-green-400 font-semibold mb-2 text-lg">
                    GCash Payment Instructions
                  </h3>
                  <p className="mb-2 text-gray-400 text-sm">
                    Please send a 50% downpayment to the following GCash number:
                  </p>
                  <p className="text-green-300 font-bold text-xl mb-2">
                    {footer.phone}
                  </p>
                  <p className="text-gray-400 text-sm mb-2">
                    Use your full name as the payment reference.
                  </p>
                  <p className="text-gray-400 text-sm mb-4">
                    After payment, upload your payment proof below.
                  </p>

                  <input
                    id="paymentProof"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    className="w-full bg-gray-900 border border-gray-600 rounded-md px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!selectedRoom}
                  className={`w-full ${
                    selectedRoom
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-green-900 cursor-not-allowed"
                  } text-gray-900 font-semibold py-3 rounded-md shadow-lg transition-colors`}
                >
                  Book Now
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Booking;
