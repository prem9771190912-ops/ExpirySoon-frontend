import { useContext, useState } from "react";
import api from "../../../config/axiosConfig";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../utils/contexts/AuthProvider";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { isLoading, isAuthenticated, setIsAuthenticated, checkAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
        <span className="w-2 h-2 rounded-full bg-slate-400 animate-ping mr-2" />
        Loading session...
      </div>
    );
  }

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await api.post("/user/login", {
        email,
        password,
      });

      const { token } = res.data;

      if (res.status === 200 && token) {
        localStorage.setItem("token", token);
        await checkAuth();
        setIsAuthenticated(true);
        navigate("/");
      } else {
        setError("Authentication error. Please try again.");
      }
    } catch (err) {
      console.warn("Login Failed:", err.response?.data || err.message);
      const serverMessage =
        (typeof err.response?.data === "string" ? err.response?.data : null) ||
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Invalid email or password. Please verify your credentials.";
      setError(serverMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-slate-800/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-white text-slate-950 flex items-center justify-center mx-auto mb-4 shadow-lg font-bold text-xl">
            <svg
              className="w-6 h-6 text-slate-950"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.2"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome to Dispozz
          </h1>
          <p className="text-sm text-slate-400 mt-1.5">
            Smart expiry tracking to prevent waste and save money.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-3xl p-7 sm:p-9 shadow-2xl">
          <h2 className="text-lg font-bold text-slate-100 mb-5">Sign in to your account</h2>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs font-medium rounded-xl flex items-center gap-2.5">
              <svg className="w-4 h-4 shrink-0 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-sm bg-slate-950/70 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Password
                </label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm bg-slate-950/70 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-3 px-4 bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all active:scale-98 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Switch to Signup */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center text-xs text-slate-400">
            Don't have an account yet?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-white font-semibold hover:underline cursor-pointer"
            >
              Create account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
