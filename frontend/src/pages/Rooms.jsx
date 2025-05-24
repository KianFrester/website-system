import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../api/CreateClient";
import { useNavigate } from "react-router-dom";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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

    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }

    fetchRooms();
    fetchUser();
  }, []);

  const handleBookNow = () => {
    if (!user) {
      sessionStorage.setItem("redirectRoomId", selectedRoom.id);
      navigate("/signin");
    } else {
      navigate("/booking");
    }
  };

  return (
    <div className="bg-gray-800 text-white min-h-screen isolate">
      <Navbar />

      {/* Header */}
      <div className="text-center py-12 px-4 bg-gray-900">
        <h1 className="text-4xl md:text-5xl font-bold font-playfair mb-3">
          Our Available Rooms
        </h1>
        <p className="text-lg text-gray-200 font-light">
          Choose the perfect stay for your trip
        </p>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 md:px-12 py-12 bg-gray-900">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-gray-700 rounded-xl shadow-lg overflow-hidden border border-gray-600 transition transform hover:scale-[1.02] hover:shadow-2xl cursor-pointer"
            onClick={() => setSelectedRoom(room)}
          >
            <img
              src={room.image}
              alt={room.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-semibold">{room.name}</h2>
              <p className="text-gray-300 line-clamp-2">{room.about}</p>
              <div className="grid grid-cols-2 gap-4 bg-gray-800 rounded-lg p-3 border border-gray-600">
                <div>
                  <p className="text-xs text-gray-400">Size</p>
                  <p>{room.size} sqm</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Occupancy</p>
                  <p>{room.occupancy}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Bed</p>
                  <p>{room.bed}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">View</p>
                  <p>{room.view}</p>
                </div>
              </div>
              <p className="text-green-400 font-bold text-xl pt-2 border-t border-gray-600">
                ₱{room.cost}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Room Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-600 rounded-2xl shadow-xl max-w-4xl w-full p-6 overflow-y-auto max-h-[90vh] relative">
            <button
              onClick={() => setSelectedRoom(null)}
              className="absolute top-4 right-4 text-white text-2xl hover:text-red-500 transition"
            >
              ×
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src={selectedRoom.image}
                  alt={selectedRoom.name}
                  className="w-full h-96 object-cover rounded-xl"
                />
              </div>
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold font-playfair mb-2">
                    {selectedRoom.name}
                  </h2>
                  <p className="text-gray-300">{selectedRoom.about}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Room Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                    <div>
                      <p className="text-gray-400">Size</p>
                      <p>{selectedRoom.size} sqm</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Occupancy</p>
                      <p>{selectedRoom.occupancy}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Bed</p>
                      <p>{selectedRoom.bed}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">View</p>
                      <p>{selectedRoom.view}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Amenities
                  </h3>
                  <p className="text-gray-300">{selectedRoom.amenities}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm text-gray-400">Check-in</h4>
                    <p className="text-gray-200">{selectedRoom.checkin}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-400">Check-out</h4>
                    <p className="text-gray-200">{selectedRoom.checkout}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Rules
                  </h3>
                  <p className="text-gray-300">{selectedRoom.rules}</p>
                </div>

                <p className="text-green-400 font-bold text-2xl">
                  ₱{selectedRoom.cost}
                </p>

                <button
                  onClick={handleBookNow}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition duration-300"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Rooms;
