import { useNavigate } from "react-router-dom";

const categoriesData = [
  {
    name: "Food",
    desc: "Perishables, dairy, snacks & packaged food",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    accent: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    name: "Medicine",
    desc: "Syrups, tablets, ointments & first aid",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
    ),
    accent: "bg-indigo-50 text-indigo-600 border-indigo-100",
  },
  {
    name: "Grocery",
    desc: "Grains, pulses, spices, oils & staples",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    ),
    accent: "bg-sky-50 text-sky-600 border-sky-100",
  },
  {
    name: "Babycare",
    desc: "Baby food, wipes, lotions & diapers",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    accent: "bg-purple-50 text-purple-600 border-purple-100",
  },
  {
    name: "Cosmetics",
    desc: "Skincare, serums, creams & makeup",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        />
      </svg>
    ),
    accent: "bg-pink-50 text-pink-600 border-pink-100",
  },
  {
    name: "Others",
    desc: "Batteries, cleaning supplies & miscellaneous",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
    accent: "bg-slate-100 text-slate-700 border-slate-200",
  },
];

const Categories = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Browse by Category</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Organize and quickly audit items grouped by product type.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {categoriesData.map((cat) => (
          <button
            key={cat.name}
            onClick={() => navigate(`/categories/${cat.name}`)}
            className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 text-left flex items-start justify-between group cursor-pointer"
          >
            <div className="space-y-2">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center border ${cat.accent} transition-transform group-hover:scale-105`}
              >
                {cat.icon}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-slate-800">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{cat.desc}</p>
              </div>
            </div>

            <span className="text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all mt-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Categories;
