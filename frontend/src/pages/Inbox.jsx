import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { UserAuth } from "../context/AuthContext";
import { supabase } from "../api/CreateClient";

const Inbox = () => {
  const { session } = UserAuth();
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("contact")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching messages:", error.message);
      } else {
        setMessages(data);
      }
    };

    fetchMessages();
  }, []);

  const deleteMessage = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this message?"
    );
    if (!confirmDelete) return;

    const { error } = await supabase.from("contact").delete().eq("id", id);
    if (error) {
      console.error("Error deleting message:", error.message);
    } else {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== id)
      );
      setSelectedMessage(null); 
    }
  };

  const handleCardClick = (msg) => {
    setSelectedMessage(msg);
  };

  const closeModal = () => {
    setSelectedMessage(null);
  };

  return (
    <>
      <div className="bg-gray-700 text-white min-h-screen isolate">
        <Navbar />
        <div className="bg-black text-white min-h-screen">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-semibold text-center mb-6">
              Admin Inbox
            </h1>

            <div className="flex justify-center my-4 text-lg">
              <h2 className="text-gray-300 text-center">
                Welcome {session?.user?.email}, This is your messages box!
              </h2>
            </div>

            <div className="space-y-6">
              {messages.length === 0 ? (
                <div className="text-center text-lg text-gray-400">
                  No new messages
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => handleCardClick(msg)}
                    className="bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl shadow-lg hover:shadow-2xl transition cursor-pointer p-6"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-xl">{msg.name}</h3>
                        <p className="text-sm text-gray-300">
                          <strong>Email:</strong> {msg.email}
                        </p>
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(msg.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="mt-4 text-base text-gray-200 line-clamp-2">
                      <strong>Message:</strong> {msg.message}
                    </div>
                    <div className="mt-4 flex justify-end space-x-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); 
                          deleteMessage(msg.id);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full-screen Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-6">
          <div className="bg-white text-black max-w-3xl w-full rounded-2xl shadow-2xl p-8 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-2xl font-bold text-gray-700 hover:text-black"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-2">{selectedMessage.name}</h2>
            <p className="text-sm text-gray-500 mb-4">
              {selectedMessage.email} |{" "}
              {new Date(selectedMessage.created_at).toLocaleString()}
            </p>
            <div className="text-lg leading-relaxed whitespace-pre-line">
              {selectedMessage.message}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => deleteMessage(selectedMessage.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Delete Message
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Inbox;
