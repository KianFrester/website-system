import React, { useEffect, useState } from "react";
import { supabase } from "../api/CreateClient";
import { Link } from "react-router-dom";

const Footer = () => {
  const date = new Date().getFullYear();
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

  return (
    <footer className="bg-black/30 bg-gradient-to-r from-black/70 via-black/50 to-black/70 backdrop-blur-md text-white pt-10 pb-4 px-6 md:px-20 text-sm">
      <div className="flex flex-wrap justify-between gap-6 mb-6">
        <div className="flex-1 min-w-[180px]">
          <h3 className="text-lg text-white-400 font-semibold mb-3">
            Elpise Inn Hostel
          </h3>
          <p className="text-gray-300 leading-relaxed">{footer?.intro}</p>
        </div>

        <div className="flex-1 min-w-[180px]">
          <h3 className="text-lg text-white-400 font-semibold mb-3">Contact</h3>
          <p className="text-gray-300 mb-1">
            <Link
              to={`tel:${footer?.phone}`}
              className="text-gray-300 hover:text-teal-300 transition"
            >
              📞 {footer?.phone}
            </Link>
          </p>
          <p className="text-gray-300 mb-1">
            <Link
              to={`mailto:${footer?.email}`}
              className="text-gray-300 hover:text-teal-300 transition"
            >
              ✉️ {footer?.email}
            </Link>
          </p>
          <p className="text-gray-300">
            <Link
              to={`https://maps.google.com/?q=${encodeURIComponent(
                footer?.location
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-teal-300 transition"
            >
              📍 {footer?.location}
            </Link>
          </p>
        </div>

        <div className="flex-1 min-w-[180px]">
          <h3 className="text-lg text-white-400 font-semibold mb-3">
            Follow Us
          </h3>
          <ul className="space-y-1">
            <li>
              <Link
                to="https://www.facebook.com/profile.php?id=100064163887347"
                className="text-gray-300 hover:text-teal-300 transition"
              >
                Facebook
              </Link>
            </li>
            <li>
              <Link
                // t be followed yung link if meron
                to="#"
                className="text-gray-300 hover:text-teal-300 transition"
              >
                Instagram
              </Link>
            </li>
            <li>
              <Link
                // t be followed yung link if meron
                to="#"
                className="text-gray-300 hover:text-teal-300 transition"
              >
                Twitter
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center border-t border-gray-700 pt-4 text-gray-400">
        <p>© {date} Elpise Inn Hostel. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
