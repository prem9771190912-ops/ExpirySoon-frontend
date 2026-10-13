import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import Categories from "./Categories";
import api from "../../../config/axiosConfig";
import fetchProducts from "../../../utils/fetchProducts";
import { AuthContext } from "../../../utils/contexts/AuthProvider";

import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import Categories from "./Categories";
import api from "../../../config/axiosConfig";
import fetchProducts from "../../../utils/fetchProducts";
import { AuthContext } from "../../../utils/contexts/AuthProvider";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const loaderRef = useRef(null);

  const [activeTab, setActiveTab] = useState(localStorage.getItem("lastActiveTab") || "all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'expiring', 'expired', 'safe'

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const sortBy = searchParams.get("sortBy") || "expiry";

  const { user } = useContext(AuthContext);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/product/${id}`);
      setProducts((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  useEffect(() => {
    fetchProducts(setLoading, setProducts, setTotalPages, page, sortBy, "all");
  }, [page, sortBy]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && page < totalPages) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loading, page, totalPages]);

  useEffect(() => {
    setPage(1);
    setProducts([]);
    setTotalPages(1);
  }, [sortBy]);

  // Metric computations
  const now = new Date();
  const expiredCount = products.filter((p) => new Date(p.expiry) < now).length;
  const expiringSoonCount = products.filter((p) => {
    const d = new Date(p.expiry);
    const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  }).length;
  const safeCount = products.filter((p) => {
    const d = new Date(p.expiry);
    const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 7;
  }).length;

  // Filtered products for client-side search & quick status filters
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === "all") return true;
    const d = new Date(p.expiry);
    const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (statusFilter === "expired") return diffDays < 0;
    if (statusFilter === "expiring") return diffDays >= 0 && diffDays <= 7;
    if (statusFilter === "safe") return diffDays > 7;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Inventory Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track expiry dates across all your household products and essentials.
          </p>
        </div>

        <button
          onClick={() => navigate("/add-product")}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-xs hover:shadow transition cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div
          onClick={() => setStatusFilter("all")}
          className={`p-4 rounded-xl border transition cursor-pointer ${
            statusFilter === "all"
              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
              : "bg-white text-slate-800 border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="text-xs font-medium uppercase tracking-wider opacity-75">Total Items</div>
          <div className="text-2xl font-bold mt-1">{products.length}</div>
        </div>

        <div
          onClick={() => setStatusFilter("expiring")}
          className={`p-4 rounded-xl border transition cursor-pointer ${
            statusFilter === "expiring"
              ? "bg-amber-500 text-white border-amber-500 shadow-sm"
              : "bg-white text-slate-800 border-slate-200 hover:border-amber-300"
          }`}
        >
          <div className="text-xs font-medium uppercase tracking-wider text-amber-600">Expiring Soon</div>
          <div className="text-2xl font-bold mt-1 text-amber-700">{expiringSoonCount}</div>
        </div>

        <div
          onClick={() => setStatusFilter("expired")}
          className={`p-4 rounded-xl border transition cursor-pointer ${
            statusFilter === "expired"
              ? "bg-rose-600 text-white border-rose-600 shadow-sm"
              : "bg-white text-slate-800 border-slate-200 hover:border-rose-300"
          }`}
        >
          <div className="text-xs font-medium uppercase tracking-wider text-rose-600">Expired</div>
          <div className="text-2xl font-bold mt-1 text-rose-700">{expiredCount}</div>
        </div>

        <div
          onClick={() => setStatusFilter("safe")}
          className={`p-4 rounded-xl border transition cursor-pointer ${
            statusFilter === "safe"
              ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
              : "bg-white text-slate-800 border-slate-200 hover:border-emerald-300"
          }`}
        >
          <div className="text-xs font-medium uppercase tracking-wider text-emerald-600">Fresh & Safe</div>
          <div className="text-2xl font-bold mt-1 text-emerald-700">{safeCount}</div>
        </div>
      </div>

      {/* Tabs & Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* View Tabs */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl self-start">
          <button
            onClick={() => {
              localStorage.setItem("lastActiveTab", "all");
              setActiveTab("all");
            }}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "all"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => {
              localStorage.setItem("lastActiveTab", "categories");
              setActiveTab("categories");
            }}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "categories"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Categories
          </button>
        </div>

        {/* Search & Sort Filters */}
        {activeTab === "all" && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <svg
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => updateParam("sortBy", e.target.value)}
                className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-700"
              >
                <option value="expiry">Expiry (Nearest first)</option>
                <option value="last-modified">Recently Added / Modified</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {activeTab === "all" ? (
        <>
          {filteredProducts.length > 0 ? (
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onDelete={() => handleDelete(product._id)}
                />
              ))}
            </div>
          ) : !loading ? (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-xs">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 mx-auto mb-4">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                {searchQuery || statusFilter !== "all"
                  ? "No matching products found"
                  : "No products tracked yet"}
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                {searchQuery || statusFilter !== "all"
                  ? "Try clearing your filters or search term to see more items."
                  : "Add your groceries, medicines, or cosmetics to get notified before they spoil."}
              </p>
              {searchQuery || statusFilter !== "all" ? (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                >
                  Clear Filters
                </button>
              ) : (
                <button
                  onClick={() => navigate("/add-product")}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition"
                >
                  Add Your First Product
                </button>
              )}
            </div>
          ) : null}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-center justify-center gap-2 py-6 text-slate-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-ping" />
              Loading items...
            </div>
          )}
          <div ref={loaderRef} className="h-1" />
        </>
      ) : (
        <Categories />
      )}
    </div>
  );
};

export default Home;


