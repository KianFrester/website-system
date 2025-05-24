import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Rooms from "../pages/Rooms";
import Contact from "../pages/Contact";
import Booking from "../pages/Booking";
import NotFound from "../components/404";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import Inbox from "../pages/Inbox";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "./PrivateRoute";
import Edit_Rooms from "../pages/Edit_Rooms";
import RedirectHandler from "../context/RedirectHandler";
import My_Booking from "../pages/My_Booking";
import TermsAndPrivacy from "../pages/TermsAndPrivacy";

const RouterPage = () => {
  return (
    <>
      <Router>
        <RedirectHandler />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/signin" element={<Signin />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/rooms" element={<Rooms />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="*" element={<NotFound />}></Route>
          <Route path="/terms-and-privacy" element={<TermsAndPrivacy />}></Route>
          <Route
            path="/edit-rooms"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <Edit_Rooms />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/my-booking"
            element={
              <PrivateRoute allowedRoles={["user"]}>
                <My_Booking />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/booking"
            element={
              <PrivateRoute allowedRoles={["user"]}>
                <Booking />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/inbox"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <Inbox />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <Dashboard />
              </PrivateRoute>
            }
          ></Route>
        </Routes>
      </Router>
    </>
  );
};

export default RouterPage;
