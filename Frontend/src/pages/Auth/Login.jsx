import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { TailSpin } from 'react-loader-spinner';
import { useAuthHook } from './hooks/useAuthHook';

function GoogleIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const {login, isLoginPending} = useAuthHook();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    login({email,password});
  };



  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans selection:bg-[#6c4f91]/20 antialiased">
      {/* Top Header */}
      <header className="w-full px-8 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/logo.png" 
            alt="CodeTier" 
            className="h-8 w-auto object-contain brightness-0" 
            referrerPolicy="no-referrer"
          />
        </Link>
        <Link
          to="/sign-up"
          className="text-sm font-semibold text-zinc-800 hover:text-[#6c4f91] transition-colors"
        >
          Sign up
        </Link>
      </header>

      {/* Center Form Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[380px] space-y-6">
          {/* Centered Icon & Heading */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-3">
              {/* <img 
                src="/logo.png" 
                alt="CodeTier" 
                className="h-10 w-auto object-contain brightness-0" 
                referrerPolicy="no-referrer"
              /> */}
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              Log in to your account
            </h1>
            <p className="text-xs text-zinc-500 font-medium">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-[#6c4f91] underline font-semibold hover:text-[#5a3f7c] transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="myemail@email.com"
                required
                className="w-full h-10 px-3.5 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#6c4f91]/30 focus:border-[#6c4f91] transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full h-10 pl-3.5 pr-10 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#6c4f91]/30 focus:border-[#6c4f91] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember for 30 days */}
            {/* <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-300 text-[#6c4f91] focus:ring-[#6c4f91] accent-[#6c4f91] cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="text-xs text-zinc-600 font-medium select-none cursor-pointer"
              >
                Remember for 30 days
              </label>
            </div> */}

            {/* Sign in Button */}
            <button
              type="submit"
              disabled={isLoginPending}
              className="w-full h-10 bg-[#6c4f91] hover:bg-[#5a3f7c] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoginPending ? (
                <TailSpin height={20} width={20} color="#ffffff" ariaLabel="loading" />
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="w-full border-t border-zinc-200" />
            <span className="bg-white px-2 text-[11px] font-medium text-zinc-400 uppercase tracking-wider absolute">
              or
            </span>
          </div>

          {/* Google Sign in Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full h-10 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg text-sm font-semibold text-zinc-700 flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <GoogleIcon className="w-4 h-4" />
            <span>Sign in with Google</span>
          </button>

          {/* Forgot password? */}
          <div className="text-center pt-2">
            <a
              href="#forgot-password"
              onClick={(e) => {
                e.preventDefault();
                toast.info('Password reset link sent to your email');
              }}
              className="text-xs font-semibold text-[#6c4f91] underline hover:text-[#5a3f7c] transition-colors"
            >
              Forgot password?
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
