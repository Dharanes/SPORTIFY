import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import Layout from "./components/Layout/Layout";
import store, { persistor } from "./ReduxToolKit/Store";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home/Home";
import SignUp from "./components/Login/SignUp";
import SignIn from "./components/Login/SignIn";
import FindTurf from "./components/FindTurf/FindTurf";
import Profile from "./components/Profile/Profile";
import TurfDetails from "./components/Turf/TurfDetails";
import AddTurf from "./components/Profile/AddTurf"
import Booking from "./components/Booking/Booking";
import AboutTurf from "./components/Profile/AboutTurf";
import Payment from "./components/Booking/Payment";
import PaymentSuccess from "./components/Booking/PaymentSuccess";
import AboutUs from "./components/Info/AboutUs";
import Contact from "./components/Info/Contact";
import Policy from "./components/Info/Policy";
import Conditions from "./components/Info/Conditions";
import AdminDashboard from "./components/Admin/AdminDashboard";
import PrivateRoute from "./common/PrivateRoute";
import PublicRoute from "./common/PublicRoute";
import NotAuthorized from "./common/NotAuthorized";
import NotFound from "./common/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <PublicRoute element={Home} />,
      },
      {
        path: "/signup",
        element: <PublicRoute element={SignUp} />,
      },
      {
        path: "/signin",
        element: <PublicRoute element={SignIn} />,
      },
      {
        path: "/find-turf/:turfLocation",
        element: <PublicRoute element={FindTurf} />,
      },
      {
        path: "/turf-details/:turfName",
        element: <PublicRoute element={TurfDetails} />,
      },
      {
        path: "/about",
        element: <PublicRoute element={AboutUs} />,
      },
      {
        path: "/contact",
        element: <PublicRoute element={Contact} />,
      },
      {
        path: "/policy",
        element: <PublicRoute element={Policy} />,
      },
      {
        path: "/conditions",
        element: <PublicRoute element={SignUp} />,
      },
      
      {
        path: "/profile",
        element: <PrivateRoute element={Profile} allowedRoles={["OWNER","USER"]} />,
      },
      {
        path: "/turf-data",
        element: <PrivateRoute element={AboutTurf} allowedRoles={["OWNER"]} />,
      },
      
      {
        path: "/add-turf",
        element: <PrivateRoute element={AddTurf} allowedRoles={["OWNER"]} />,
      },
      {
        path: "/booking",
        element: <PrivateRoute element={Booking} allowedRoles={["USER"]} />,
      },
      {
        path: "/booking/payment",
        element: <PrivateRoute element={Payment} allowedRoles={["USER"]} />,
      },
      {
        path: "/booking/success",
        element: <PrivateRoute element={PaymentSuccess} allowedRoles={["USER"]} />,
      },
      {
        path: "/dashboard",
        element: <PrivateRoute element={AdminDashboard} allowedRoles={["ADMIN"]} />,
      },
      {
        path: "/not-authorized",
        element: <NotAuthorized />
      },
      {
        path: "*",
        element: <NotFound />, 
      }
      
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </StrictMode>
);

// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import { PersistGate } from "redux-persist/integration/react";
// import { Provider } from "react-redux";
// import Layout from "./components/Layout/Layout";
// import store, { persistor } from "./ReduxToolKit/Store";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import ProtectedRoute from "./context/Protected"
// import Home from "./components/Home/Home";
// import SignUp from "./components/Login/SignUp";
// import SignIn from "./components/Login/SignIn";
// import FindTurf from "./components/FindTurf/FindTurf";
// import Profile from "./components/Profile/Profile";
// import TurfDetails from "./components/Turf/TurfDetails";
// import Booking from "./components/Booking/Booking";
// import AboutTurf from "./components/Profile/AboutTurf";
// import Payment from "./components/Booking/Payment";
// import PaymentSuccess from "./components/Booking/PaymentSuccess";
// import AboutUs from "./components/Info/AboutUs";
// import Contact from "./components/Info/Contact";
// import Policy from "./components/Info/Policy";
// import Conditions from "./components/Info/Conditions";
// import AdminDashboard from "./components/Admin/AdminDashboard";
// import AddTurf from "./components/Profile/AddTurf";
// import { RoleProvider } from "./context/RoleContext";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Layout />,
//     children: [
//       {
//         path: "/",
//         element: <Home />,
//       },
//       {
//         path: "/signup",
//         element: <SignUp />,
//       },
//       {
//         path: "/signin",
//         element: <SignIn />,
//       },
//       {
//         path: "/about",
//         element: <AboutUs />,
//       },
//       {
//         path: "/contact",
//         element: <Contact />,
//       },
//       {
//         path: "/policy",
//         element: <Policy />,
//       },
//       {
//         path: "/conditions",
//         element: <Conditions />,
//       },
//       {
//         path: "/find-turf/:turfLocation",
//         element: <FindTurf />,
//       },
//       {
//         path: "/turf-details/:turfName",
//         element: <TurfDetails />,
//       },

//       // Routes for authenticated users (user, owner, admin)
//       {
//         path: "/profile",
//         element: <ProtectedRoute allowedRoles={['USER', 'OWNER']}><Profile /></ProtectedRoute>,
//       },
//       {
//         path: "/booking",
//         element: <ProtectedRoute allowedRoles={['USER']}><Booking /></ProtectedRoute>,
//       },
//       {
//         path: "/booking/payment",
//         element: <ProtectedRoute allowedRoles={['USER']}><Payment /></ProtectedRoute>,
//       },
//       {
//         path: "/booking/success",
//         element: <ProtectedRoute allowedRoles={['USER']}><PaymentSuccess /></ProtectedRoute>,
//       },

//       // Routes for owners
//       {
//         path: "/add-turf",
//         element: <ProtectedRoute allowedRoles={['OWNER']}><AddTurf /></ProtectedRoute>,
//       },
//       {
//         path: "/about-turf",
//         element: <ProtectedRoute allowedRoles={['OWNER']}><AboutTurf /></ProtectedRoute>,
//       },

//       // Admin route
//       {
//         path: "/dashboard",
//         element: <ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>,
//       },
//     ],
//   },
// ]);

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <Provider store={store}>
//       <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
//         <RoleProvider>
//           <RouterProvider router={router} />
//         </RoleProvider>
//       </PersistGate>
//     </Provider>
//   </StrictMode>
// );
