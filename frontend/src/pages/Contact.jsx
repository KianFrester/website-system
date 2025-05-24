import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../api/CreateClient";
import emailjs from "@emailjs/browser";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const Contact = () => {
  const form = useRef();

  const sendEmail = async (e) => {
    e.preventDefault();

    const formData = new FormData(form.current);
    const data = {
      first_name: formData.get("firstName"),
      last_name: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    const { error } = await supabase.from("contact").insert([data]);
    if (error) {
      alert("Supabase error: " + error.message);
      return;
    }

    emailjs
      .sendForm("service_p4fa7fh", "template_l80ymgj", form.current, {
        publicKey: "2RpAmuHuaoMbXd7IB",
      })
      .then(
        () => {
          alert("Your message has been sent!");
        },
        (error) => {
          alert("Oops! Something went wrong: " + error.text);
        }
      );
    e.target.reset();
  };

  const [details, setDetails] = useState("");

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const { data } = await supabase
        .from("contact_details")
        .select("*")
        .single();
      setDetails(data);
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(details);

  return (
    <div className="bg-gray-700 text-white min-h-screen">
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-black/90 via-orange-1100/90 to-yellow-700/90 py-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              We're here to help and answer any questions you might have. We
              look forward to hearing from you.
            </p>
          </div>

          {/* Contact Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all">
              <div className="bg-green-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPhone className="text-green-500 text-xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Phone</h3>
              <p className="text-gray-300">{details?.phone}</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all">
              <div className="bg-green-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaEnvelope className="text-green-500 text-xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Email</h3>

              <p className="text-gray-300">{details?.email}</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all">
              <div className="bg-green-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMapMarkerAlt className="text-green-500 text-xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Location</h3>
              <p className="text-gray-300">{details?.location}</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all">
              <div className="bg-green-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaClock className="text-green-500 text-xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Working Hours</h3>
              <p className="text-gray-300">{details?.front_desk} Front Desk</p>
              <p className="text-gray-300">Check-in: {details?.check_in}</p>
            </div>
          </div>

          {/* Main Contact Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Contact Form */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form ref={form} onSubmit={sendEmail} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      className="w-full p-3 bg-white/10 text-white border border-white/20 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Roystone"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      className="w-full p-3 bg-white/10 text-white border border-white/20 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Obmana"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full p-3 bg-white/10 text-white border border-white/20 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="roystonepogi@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full p-3 bg-white/10 text-white border border-white/20 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="+63 912 345 6789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    className="w-full p-3 bg-white/10 text-white border border-white/20 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="How can we help you?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows="4"
                    className="w-full p-3 bg-white/10 text-white border border-white/20 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="Write your message here..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Right Side - Map and Additional Info */}
            <div className="space-y-8">
              {/* Map */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1983.6263615642026!2d125.28228583478375!3d6.096623682186648!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32f775971afc52d1%3A0x32dd6a6925bdf3f3!2sElpis%20Inn%20Hostel%20-%20Alabel%20Sarangani!5e0!3m2!1sen!2sph!4v1746795980397!5m2!1sen!2sph"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  className="rounded-lg"
                ></iframe>
              </div>

              {/* Additional Information */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Additional Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-green-500 font-medium mb-2">
                      Emergency Contact
                    </h4>
                    <p className="text-gray-300">
                      For urgent matters, please call our 24/7 emergency line:
                      {details?.emergency_contact}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-green-500 font-medium mb-2">
                      Social Media
                    </h4>
                    <p className="text-gray-300">
                      Follow us on social media for updates and special offers:
                    </p>
                    <div className="flex gap-4 mt-2">
                      <a
                        href="#"
                        className="text-gray-300 hover:text-green-500 transition-colors"
                      >
                        Facebook
                      </a>
                      <a
                        href="#"
                        className="text-gray-300 hover:text-green-500 transition-colors"
                      >
                        Instagram
                      </a>
                      <a
                        href="#"
                        className="text-gray-300 hover:text-green-500 transition-colors"
                      >
                        Twitter
                      </a>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-green-500 font-medium mb-2">
                      Response Time
                    </h4>
                    <p className="text-gray-300">
                      {details?.responsetime_message}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
