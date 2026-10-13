import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, onDelete }) => {
  const navigate = useNavigate();

  const now = new Date();
  const expiryDate = new Date(product.expiry);
  const purchaseDate = new Date(product.purchaseDate);

  const diffTime = expiryDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isExpired = diffDays < 0;
  const isExpiringSoon = !isExpired && diffDays <= 7;

  // Calculate life progress percentage if purchase date exists
  let lifeProgress = 50;
  if (!isNaN(purchaseDate.getTime()) && !isNaN(expiryDate.getTime())) {
    const totalLife = expiryDate.getTime() - purchaseDate.getTime();
    if (totalLife > 0) {
      const elapsed = now.getTime() - purchaseDate.getTime();
      lifeProgress = Math.min(100, Math.max(0, Math.round((elapsed / totalLife) * 100)));
    }
  }

  // Category badge colors
  const getCategoryTheme = (cat) => {
    const normalized = (cat || "").toLowerCase().trim();
    switch (normalized) {
      case "medicine":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "food":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "grocery":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "cosmetics":
        return "bg-pink-50 text-pink-700 border-pink-200";
      case "babycare":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const formatDate = (date) => {
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between group relative overflow-hidden">
      {/* Top Header: Category Tag & Expiry Status Pill */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border uppercase tracking-wider ${getCategoryTheme(
              product.category
            )}`}
          >
            {product.category || "General"}
          </span>

          {isExpired ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              {diffDays === 0 ? "Expires today" : `Expired ${Math.abs(diffDays)}d ago`}
            </span>
          ) : isExpiringSoon ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {diffDays === 1 ? "1 day left" : `${diffDays} days left`}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {diffDays} days left
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3 className="text-base font-bold text-slate-900 mb-3 group-hover:text-slate-800 transition line-clamp-1">
          {product.name}
        </h3>

        {/* Shelf Life Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isExpired
                  ? "bg-rose-500 w-full"
                  : isExpiringSoon
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }`}
              style={{ width: `${isExpired ? 100 : Math.max(10, lifeProgress)}%` }}
            />
          </div>
        </div>

        {/* Dates Meta */}
        <div className="space-y-1.5 text-xs text-slate-500">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Purchased</span>
            <span className="font-medium text-slate-700">{formatDate(purchaseDate)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Expires</span>
            <span
              className={`font-semibold ${
                isExpired ? "text-rose-600" : isExpiringSoon ? "text-amber-600" : "text-slate-800"
              }`}
            >
              {formatDate(expiryDate)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
        <button
          onClick={() =>
            navigate(`/edit-product`, {
              state: {
                ...product,
              },
            })
          }
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          Edit
        </button>
        <button
          onClick={() => {
            if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
              onDelete(product._id);
            }
          }}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
