import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import Navbar from "./src/components/Header/Navbar";
import Home from "./src/components/Home/Home";
import AddProduct from "./src/components/Product/AddProduct";
import EditProduct from "./src/components/Product/EditProduct";
import CategoryProducts from "./src/components/Home/CategoryProducts";
import { registerPush } from "./utils/registerPush";
import Login from "./src/components/Authentication/Login";
import { PrivateRoute } from "./utils/contexts/PrivateRoute";
import { AuthProvider } from "./utils/contexts/AuthProvider";
import Signup from "./src/components/Authentication/Signup";

const AppLayout = () => {
  useEffect(() => {
    registerPush();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <AppLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "/", element: <Home /> },
      { path: "/add-product", element: <AddProduct /> },
      { path: "/edit-product", element: <EditProduct /> },
      { path: "/categories/:category", element: <CategoryProducts /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Signup />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <RouterProvider router={appRouter} />
  </AuthProvider>
);
