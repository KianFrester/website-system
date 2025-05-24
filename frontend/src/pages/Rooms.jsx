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
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    }

    fetchRooms();
    fetchUser();
  }, []);

  const handleBookNow = () => {
    if (!user) {
      sessionStorage.setItem("redirectRoomId", selectedRoom.id);
      navigate("/signin");
    } else {
      navigate(`/booking`);
    }
  };

  return (
    <div className="bg-gray-700 text-white min-h-screen">
      <Navbar />
      <div className="min-h-screen text-white bg-gradient-to-b from-black/90 via-orange-1100/90 to-yellow-700/90">
        <div className="text-center py-10 px-4">
          <h1 className="text-4xl font-bold font-playfair mb-2">
            Our Available Rooms
          </h1>
          <p className="text-lg text-gray-300">Choose your perfect stay</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 pb-20">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="backdrop-blur-md bg-black/30 border border-white/20 rounded-2xl shadow-xl overflow-hidden transition hover:scale-[1.02] cursor-pointer"
              onClick={() => setSelectedRoom(room)}
            >
              <img
                className="w-full h-64 object-cover"
                src={room.image}
                alt={room.name}
              />
              <div className="p-6 space-y-4">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">{room.name}</h2>
                  <p className="text-gray-300 text-sm line-clamp-2">
                    {room.about}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">Size</p>
                    <p className="text-gray-300">{room.size} sqm</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">Occupancy</p>
                    <p className="text-gray-300">{room.occupancy}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">Bed</p>
                    <p className="text-gray-300">{room.bed}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">View</p>
                    <p className="text-gray-300">{room.view}</p>
                  </div>
                </div>

                <p className="text-red-500 font-bold text-xl pt-2 border-t border-white/10">
                  ₱{room.cost}
                </p>
              </div>
            </div>
          ))}
        </div>

        {selectedRoom && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-black/90 border border-white/20 rounded-2xl shadow-xl max-w-4xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
              <button
                onClick={() => setSelectedRoom(null)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
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
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h2 className="text-3xl font-bold mb-2">
                      {selectedRoom.name}
                    </h2>
                    <p className="text-gray-300">{selectedRoom.about}</p>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h3 className="text-lg font-semibold mb-3 text-white/90">
                      Room Specifications
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-400">Size</p>
                        <p className="text-white">{selectedRoom.size} sqm</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-400">Occupancy</p>
                        <p className="text-white">{selectedRoom.occupancy}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-400">Bed Type</p>
                        <p className="text-white">{selectedRoom.bed}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-400">View</p>
                        <p className="text-white">{selectedRoom.view}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h3 className="text-lg font-semibold mb-2 text-white/90">
                      Amenities
                    </h3>
                    <p className="text-white">{selectedRoom.amenities}</p>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h3 className="text-lg font-semibold mb-3 text-white/90">
                      Check-in/Check-out
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-400">Check-in Time</p>
                        <p className="text-white">{selectedRoom.checkin}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-400">Check-out Time</p>
                        <p className="text-white">{selectedRoom.checkout}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h3 className="text-lg font-semibold mb-2 text-white/90">
                      Rules
                    </h3>
                    <p className="text-white">{selectedRoom.rules}</p>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg border border-white/10 flex flex-col gap-4">
                    <p className="text-red-500 font-bold text-2xl">
                      ₱{selectedRoom.cost}
                    </p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10 flex flex-col gap-4" >
                    <button
                      onClick={handleBookNow}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-xl transition"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default Rooms;
