import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../api/CreateClient";
import emailjs from "@emailjs/browser";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const Contact = () => {
  const form = useRef();
  const [details, setDetails] = useState("");

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

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar />
      <div className="py-12 bg-gradient-to-br from-black via-gray-800 to-yellow-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 font-playfair">
              Get in Touch
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              We're here to help and answer any questions you might have. We
              look forward to hearing from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { icon: <FaPhone />, title: "Phone", value: details?.phone },
              { icon: <FaEnvelope />, title: "Email", value: details?.email },
              {
                icon: <FaMapMarkerAlt />,
                title: "Location",
                value: details?.location,
              },
              {
                icon: <FaClock />,
                title: "Working Hours",
                value: (
                  <>
                    {details?.front_desk} Front Desk
                    <br />
                    Check-in: {details?.check_in}
                  </>
                ),
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center hover:bg-white/20 transition"
              >
                <div className="bg-green-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  {React.cloneElement(item.icon, {
                    className: "text-green-500 text-xl",
                  })}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-300">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-10 items-start justify-between">
            <div className="w-full lg:w-1/2 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-white font-playfair">
                Send us a Message
              </h2>
              <form ref={form} onSubmit={sendEmail} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-white font-medium mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Naruto"
                      className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white font-medium mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Uzumaki"
                      className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="sample@gmail.com"
                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-white font-medium mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="eg. 123-456-7890"
                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white font-medium mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Enter subject"
                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-white font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    placeholder="Type your message here..."
                    name="message"
                    rows="4"
                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>

            <div className="w-full lg:w-1/2 space-y-8">
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-6 h-96">
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

              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Additional Information
                </h3>
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h4 className="text-green-500 font-medium">
                      Emergency Contact
                    </h4>
                    <p>{details?.emergency_contact}</p>
                  </div>
                  <div>
                    <h4 className="text-green-500 font-medium">Social Media</h4>
                    <p>Follow us on social media:</p>
                    <div className="flex gap-4 mt-2">
                      <a href="#" className="hover:text-green-500">
                        Facebook
                      </a>
                      <a href="#" className="hover:text-green-500">
                        Instagram
                      </a>
                      <a href="#" className="hover:text-green-500">
                        Twitter
                      </a>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-green-500 font-medium">
                      Response Time
                    </h4>
                    <p>{details?.responsetime_message}</p>
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
