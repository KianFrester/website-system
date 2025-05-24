import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { supabase } from "../api/CreateClient";

const RoomForm = ({ data, onChange, onSubmit, submitText, onCancel }) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4 p-4 bg-white/5 rounded-xl border border-white/20">
        <h3 className="text-lg font-semibold text-white/90 border-b border-white/20 pb-2">
          Basic Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Room Name
            </label>
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={onChange}
              placeholder="Enter room name"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Description
            </label>
            <textarea
              name="about"
              value={data.about}
              onChange={onChange}
              placeholder="Enter room description"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 h-24 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Cost (₱)
            </label>
            <input
              type="number"
              name="cost"
              value={data.cost}
              onChange={onChange}
              placeholder="Enter room cost"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4 bg-white/5 rounded-xl border border-white/20">
        <h3 className="text-lg font-semibold text-white/90 border-b border-white/20 pb-2">
          Room Details
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Size (sqm)
            </label>
            <input
              type="text"
              name="size"
              value={data.size}
              onChange={onChange}
              placeholder="Enter room size"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Occupancy
            </label>
            <input
              type="text"
              name="occupancy"
              value={data.occupancy}
              onChange={onChange}
              placeholder="Enter occupancy"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Bed Type
            </label>
            <input
              type="text"
              name="bed"
              value={data.bed}
              onChange={onChange}
              placeholder="Enter bed type"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              View
            </label>
            <input
              type="text"
              name="view"
              value={data.view}
              onChange={onChange}
              placeholder="Enter room view"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40"
            />
          </div>
        </div>
      </div>
    </div>

    <div className="p-4 bg-white/5 rounded-xl border border-white/20">
      <h3 className="text-lg font-semibold text-white/90 border-b border-white/20 pb-2 mb-4">
        Additional Information
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">
            Amenities
          </label>
          <input
            type="text"
            name="amenities"
            value={data.amenities}
            onChange={onChange}
            placeholder="Enter room amenities"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Check-in Time
            </label>
            <input
              type="text"
              name="checkin"
              value={data.checkin}
              onChange={onChange}
              placeholder="Enter check-in time"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Check-out Time
            </label>
            <input
              type="text"
              name="checkout"
              value={data.checkout}
              onChange={onChange}
              placeholder="Enter check-out time"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">
            Rules
          </label>
          <textarea
            name="rules"
            value={data.rules}
            onChange={onChange}
            placeholder="Enter room rules"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 h-24 resize-none"
          />
        </div>
      </div>
    </div>

    <div className="p-4 bg-white/5 rounded-xl border border-white/20">
      <label className="block text-sm font-medium text-white/80 mb-2">
        Room Image
      </label>
      <input
        type="file"
        onChange={(e) =>
          onChange({ target: { name: "imageFile", value: e.target.files[0] } })
        }
        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/20 file:text-white hover:file:bg-white/30"
      />
    </div>

    <div className="flex gap-4">
      <button
        type="submit"
        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
      >
        {submitText}
      </button>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Cancel
        </button>
      )}
    </div>
  </form>
);

function Edit_Rooms() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [editRoomId, setEditRoomId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    about: "",
    cost: "",
    image: "",
    size: "",
    occupancy: "",
    bed: "",
    view: "",
    amenities: "",
    checkin: "",
    checkout: "",
    rules: "",
  });
  const [newRoom, setNewRoom] = useState({
    name: "",
    about: "",
    cost: "",
    image: "",
    size: "",
    occupancy: "",
    bed: "",
    view: "",
    amenities: "",
    checkin: "",
    checkout: "",
    rules: "",
  });
  const [imageFile, setImageFile] = useState(null);

  async function fetchrooms() {
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

  const handleImageUpload = async (file) => {
    if (!file) return null;
    const fileExtension = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExtension}`;
    const bucketName = "pictures";
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file);
    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      return null;
    }
    const { data, error: urlError } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);
    if (urlError || !data?.publicUrl) {
      console.error("Error getting public URL:", urlError);
      return null;
    }
    return data.publicUrl;
  };

  async function handleCreate(e) {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to create this room?")) return;

    let imageUrl = newRoom.image;
    if (imageFile) imageUrl = await handleImageUpload(imageFile);
    if (!imageUrl) {
      alert("Image upload failed.");
      return;
    }

    const { error } = await supabase
      .from("room")
      .insert([{ ...newRoom, image: imageUrl }]);
    if (error) {
      console.error("Insert error:", error);
    } else {
      setNewRoom({
        name: "",
        about: "",
        cost: "",
        image: "",
        size: "",
        occupancy: "",
        bed: "",
        view: "",
        amenities: "",
        checkin: "",
        checkout: "",
        rules: "",
      });
      setImageFile(null);
      fetchrooms();
      alert("Room successfully added!");
    }
  }

  async function handleUpdate(id) {
    if (!window.confirm("Are you sure you want to update this room?")) return;

    let imageUrl = editData.image;
    if (imageFile) imageUrl = await handleImageUpload(imageFile);
    if (!imageUrl) {
      alert("Image upload failed.");
      return;
    }

    const { error } = await supabase
      .from("room")
      .update({ ...editData, image: imageUrl })
      .eq("id", id);
    if (error) {
      console.error("Update error:", error);
    } else {
      setEditRoomId(null);
      setImageFile(null);
      fetchrooms();
      alert("Room successfully updated!");
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this room?"
    );
    if (!confirmed) return;
    const { error } = await supabase.from("room").delete().eq("id", id);
    if (error) {
      console.error("Delete error:", error);
    } else {
      fetchrooms();
      alert("Data successfully deleted!");
    }
  }

  function handleEditClick(room) {
    setEditRoomId(room.id);
    setEditData({
      name: room.name,
      about: room.about,
      cost: room.cost,
      image: room.image,
      size: room.size,
      occupancy: room.occupancy,
      bed: room.bed,
      view: room.view,
      amenities: room.amenities,
      checkin: room.checkin,
      checkout: room.checkout,
      rules: room.rules,
    });
  }

  function handleNewChange(e) {
    if (e.target.name === "imageFile") {
      setImageFile(e.target.value);
    } else {
      setNewRoom((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  }

  function handleEditChange(e) {
    if (e.target.name === "imageFile") {
      setImageFile(e.target.value);
    } else {
      setEditData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  }

  useEffect(() => {
    fetchrooms();
  }, []);

  return (
    <div className="bg-gray-700 text-white min-h-screen">
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-black via-orange-1000 to-orange-800 p-4">
        <h1 className="text-3xl font-bold text-center mb-8">Room Management</h1>

        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Add New Room</h2>
          <RoomForm
            data={newRoom}
            onChange={handleNewChange}
            onSubmit={handleCreate}
            submitText="Create Room"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden"
            >
              <img
                src={room.image}
                alt={room.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                {editRoomId === room.id ? (
                  <RoomForm
                    data={editData}
                    onChange={handleEditChange}
                    onSubmit={() => handleUpdate(room.id)}
                    submitText="Save Changes"
                    onCancel={() => setEditRoomId(null)}
                  />
                ) : (
                  <>
                    <h3 className="text-xl font-bold mb-2">{room.name}</h3>
                    <p className="text-sm mb-2">{room.about}</p>
                    <p className="text-lg font-semibold mb-4">₱{room.cost}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                      <p>Size: {room.size} sqm</p>
                      <p>Occupancy: {room.occupancy}</p>
                      <p>Bed: {room.bed}</p>
                      <p>View: {room.view}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(room)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(room.id)}
                        className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {selectedRoom && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl max-w-2xl w-full p-6 relative">
              <button
                onClick={() => setSelectedRoom(null)}
                className="absolute top-4 right-4 text-white hover:text-gray-300"
              >
                ×
              </button>
              <img
                src={selectedRoom.image}
                alt={selectedRoom.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h2 className="text-2xl font-bold mb-2">{selectedRoom.name}</h2>
              <p className="mb-4">{selectedRoom.about}</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm">Size: {selectedRoom.size} sqm</p>
                  <p className="text-sm">Occupancy: {selectedRoom.occupancy}</p>
                  <p className="text-sm">Bed: {selectedRoom.bed}</p>
                  <p className="text-sm">View: {selectedRoom.view}</p>
                </div>
                <div>
                  <p className="text-sm">Check-in: {selectedRoom.checkin}</p>
                  <p className="text-sm">Check-out: {selectedRoom.checkout}</p>
                  <p className="text-sm">Amenities: {selectedRoom.amenities}</p>
                  <p className="text-sm">Rules: {selectedRoom.rules}</p>
                </div>
              </div>
              <p className="text-xl font-semibold">₱{selectedRoom.cost}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Edit_Rooms;
