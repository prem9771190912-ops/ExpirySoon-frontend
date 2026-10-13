import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import api from "../../../config/axiosConfig";
import fetchProducts from "../../../utils/fetchProducts";

const CategoryProducts = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const decoded = decodeURIComponent(category);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "expiry");
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);

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

    if (key !== "page") {
      params.set("page", "1");
      setPage(1);
    }

    setSearchParams(params);
  };

  useEffect(() => {
    fetchProducts(setLoading, setProducts, setTotalPages, page, sortBy, decoded);
  }, [decoded, sortBy, page]);

  useEffect(() => {
    const paramSortBy = searchParams.get("sortBy") || "expiry";
    const paramPage = parseInt(searchParams.get("page")) || 1;

    setSortBy(paramSortBy);
    setPage(paramPage);
  }, [searchParams]);

  return (
    <div className="space-y-6">
      {/* Back button & Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{decoded}</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {products.length} {products.length === 1 ? "item" : "items"}
            </span>
          </h1>
        </div>

        {/* Sort & Add CTA */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => updateParam("sortBy", e.target.value)}
              className="text-xs font-medium bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-700 shadow-xs"
            >
              <option value="expiry">Expiry (Nearest)</option>
              <option value="last-modified">Recently Modified</option>
            </select>
          </div>

          <button
            onClick={() => navigate("/add-product")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition"
          >
            + Add to {decoded}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-slate-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-slate-400 animate-ping" />
          Loading products...
        </div>
      ) : products.length > 0 ? (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onDelete={() => handleDelete(product._id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-xs">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 mx-auto mb-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No items in {decoded}</h3>
          <p className="text-xs text-slate-500 mb-5">
            Add your first product in this category to track its shelf life.
          </p>
          <button
            onClick={() => navigate("/add-product")}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition"
          >
            Add Item to {decoded}
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;

