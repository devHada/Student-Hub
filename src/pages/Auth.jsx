import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, signUp, signInWithGoogle } from "../firebase/auth";
import { createUserProfile } from "../firebase/users";

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); // toggle between login and signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        navigate("/loading");
      } else {
        const result = await signUp(email, password);
        await createUserProfile(result.user);
        navigate("/loading");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    try {
      const result = await signInWithGoogle();
      await createUserProfile(result.user);
      navigate("/loading");
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <div className="min-h-screen bg-[#f5f0e8] flex">
      {/* LEFT SIDE - image */}
      <div
        className="hidden md:block w-1/2"
        style={{
          backgroundImage: `linear-gradient(rgba(44,24,16,0.5), rgba(44,24,16,0.5)), url('https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="h-full flex flex-col justify-center items-center text-white px-12">
          <h1 className="text-4xl font-bold mb-4">Student Hub</h1>
          <p className="text-center text-[#e8d5b7] text-lg">
            Your all-in-one platform to study smarter, collaborate better, and
            achieve more.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-8">
        <div className="w-full max-w-md">
          {/* title */}
          <h2 className="text-3xl font-bold text-[#2c1810] mb-2">
            {isLogin ? "Welcome Back!" : "Create Account"}
          </h2>
          <p className="text-[#6b4c3b] mb-8">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#8b4513] font-bold hover:underline"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>

          {/* error message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          {/* form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* name field - only on signup */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-[#2c1810] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 border border-[#c4a882] rounded bg-white focus:outline-none focus:border-[#8b4513] text-[#2c1810]"
                  required
                />
              </div>
            )}

            {/* email */}
            <div>
              <label className="block text-sm font-medium text-[#2c1810] mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-[#c4a882] rounded bg-white focus:outline-none focus:border-[#8b4513] text-[#2c1810]"
                required
              />
            </div>

            {/* password */}
            <div>
              <label className="block text-sm font-medium text-[#2c1810] mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-[#c4a882] rounded bg-white focus:outline-none focus:border-[#8b4513] text-[#2c1810]"
                required
              />
            </div>

            {/* submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#8b4513] text-white rounded font-medium hover:bg-[#6b3410] transition-all disabled:opacity-50"
            >
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>

          {/* divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-[#c4a882]"></div>
            <span className="px-4 text-[#6b4c3b] text-sm">OR</span>
            <div className="flex-1 border-t border-[#c4a882]"></div>
          </div>

          {/* google button */}
          <button
            onClick={handleGoogle}
            className="w-full py-3 border border-[#c4a882] rounded font-medium text-[#2c1810] hover:bg-[#ede8dc] transition-all flex items-center justify-center gap-3"
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
