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

export default function SignUp() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigate = useNavigate();
  const {signUp, isSignUpPending} = useAuthHook();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username|| !name || !email || !password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!agreeTerms) {
      toast.error('Please agree to the Terms of Service');
      return;
    }
    signUp({username,email,password,name})
  };

  const handleGoogleSignUp = () => {
    toast.success('Google sign-up successful!');
    navigate('/candidate/dashboard');
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
          to="/login"
          className="text-sm font-semibold text-zinc-800 hover:text-[#6c4f91] transition-colors"
        >
          Log in
        </Link>
      </header>

      {/* Center Form Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[380px] space-y-5">
          {/* Centered Icon & Heading */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-3">
              <img 
                src="/logo.png" 
                alt="CodeTier" 
                className="h-10 w-auto object-contain brightness-0" 
                referrerPolicy="no-referrer"
              />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              Create an account
            </h1>
            <p className="text-xs text-zinc-500 font-medium">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-[#6c4f91] underline font-semibold hover:text-[#5a3f7c] transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 block">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full h-10 px-3.5 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#6c4f91]/30 focus:border-[#6c4f91] transition-all"
              />
            </div>
            
            {/* Username */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 block">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe1234"
                required
                className="w-full h-10 px-3.5 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#6c4f91]/30 focus:border-[#6c4f91] transition-all"
              />
            </div>


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
                  placeholder="Create a password"
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

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 block">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                className="w-full h-10 px-3.5 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#6c4f91]/30 focus:border-[#6c4f91] transition-all"
              />
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-zinc-300 text-[#6c4f91] focus:ring-[#6c4f91] accent-[#6c4f91] cursor-pointer shrink-0"
              />
              <label
                htmlFor="terms"
                className="text-xs text-zinc-600 font-normal leading-tight select-none cursor-pointer"
              >
                I agree to the{' '}
                <a
                  href="#terms"
                  onClick={(e) => e.preventDefault()}
                  className="text-[#6c4f91] underline font-medium hover:text-[#5a3f7c]"
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="#privacy"
                  onClick={(e) => e.preventDefault()}
                  className="text-[#6c4f91] underline font-medium hover:text-[#5a3f7c]"
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Sign up Button */}
            <button
              type="submit"
              disabled={isSignUpPending}
              className="w-full h-10 bg-[#6c4f91] hover:bg-[#5a3f7c] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSignUpPending ? (
                <TailSpin height={20} width={20} color="#ffffff" ariaLabel="loading" />
              ) : (
                'Sign up'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-3">
            <div className="w-full border-t border-zinc-200" />
            <span className="bg-white px-2 text-[11px] font-medium text-zinc-400 uppercase tracking-wider absolute">
              or
            </span>
          </div>

          {/* Google Sign up Button */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="w-full h-10 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg text-sm font-semibold text-zinc-700 flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <GoogleIcon className="w-4 h-4" />
            <span>Sign up with Google</span>
          </button>
        </div>
      </main>
    </div>
  );
}
