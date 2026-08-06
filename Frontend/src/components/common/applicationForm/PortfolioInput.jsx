import React from 'react';
import { Plus, Trash2, Globe } from 'lucide-react';

function GithubLogo({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinLogo({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.78a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
    </svg>
  );
}

function CodeTierLogoIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 90 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M 68 25 V 17 H 50 L 20 47 L 50 77 H 68 V 69 H 54 V 57 H 42 V 45 H 30 L 50 25 H 68 Z" 
        stroke="currentColor" 
        strokeWidth="7" 
        strokeLinecap="square" 
        strokeLinejoin="miter"
        fill="none"
      />
    </svg>
  );
}

function TwitterXLogo({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function DribbbleLogo({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm6.82 7.22a8.07 8.07 0 0 1-3.6 1.83 23 23 0 0 0-1.42-3.12 8 8 0 0 1 5.02 1.29zM12 4a7.92 7.92 0 0 1 3.23.69 22 22 0 0 1 1.3 2.9A30.6 30.6 0 0 0 9.8 9 22.8 22.8 0 0 1 12 4zm-4.14 6A28.7 28.7 0 0 1 14.3 8.3a20.7 20.7 0 0 1 1.28 2.87A18.8 18.8 0 0 1 8.3 13.5a18.3 18.3 0 0 1-.44-3.5zm-3.8 2a8 8 0 0 1 3.12-6.14 20.5 20.5 0 0 0 .5 3.86 20.2 20.2 0 0 0-3.62 2.28zM12 20a7.92 7.92 0 0 1-4.73-1.57A18.4 18.4 0 0 1 11 14.8a30 30 0 0 0 4.22 4.47A7.9 7.9 0 0 1 12 20zm4.55-2.22A28 28 0 0 1 12.6 13.5a17.2 17.2 0 0 0 6.64-1.78 8 8 0 0 1-2.69 6.06z" />
    </svg>
  );
}

function BehanceLogo({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M22 7h-7V5h7v2zm-1.708 6.13c0-2.455-1.543-3.63-3.792-3.63-2.316 0-3.9 1.472-3.9 3.738 0 2.222 1.498 3.762 3.948 3.762 1.956 0 3.18-.89 3.593-2.261h-1.921c-.2.433-.82.802-1.58.802-1.026 0-1.802-.55-1.89-1.631h5.518c.01-.26.024-.54.024-.78zm-5.602-.792c.112-.911.83-1.391 1.76-1.391.861 0 1.631.451 1.742 1.391h-3.502zM10.15 11.23c.82-.41 1.33-1.12 1.33-2.09 0-1.75-1.31-2.64-3.41-2.64H2v11h6.29c2.32 0 3.73-1.02 3.73-2.82 0-1.36-.72-2.19-1.87-2.45zM4.68 8.16h3.01c.96 0 1.55.37 1.55 1.13 0 .79-.62 1.19-1.58 1.19H4.68V8.16zm3.32 7.42H4.68v-2.58h3.32c1.07 0 1.74.42 1.74 1.28 0 .88-.67 1.3-1.74 1.3z" />
    </svg>
  );
}

function PlatformLogo({ platform, className = "w-4 h-4" }) {
  switch (platform) {
    case 'GITHUB':
      return <GithubLogo className={`${className} text-white`} />;
    case 'LINKEDIN':
      return <LinkedinLogo className={`${className} text-[#0a66c2]`} />;
    case 'PORTFOLIO':
      return <CodeTierLogoIcon className={`${className} text-[#c084fc]`} />;
    case 'HACKERRANK':
      return <BehanceLogo className={`${className} text-[#00ea64]`} />;
    case 'LEETCODE':
    case 'CODEFORCES':
    case 'CODECHEF':
      return <DribbbleLogo className={`${className} text-[#ffa116]`} />;
    case 'OTHER':
      return <TwitterXLogo className={`${className} text-white`} />;
    default:
      return <Globe className={`${className} text-purple-300`} />;
  }
}

const PLATFORM_OPTIONS = [
  { id: 'GITHUB',     label: 'GitHub',      placeholder: 'https://github.com/username' },
  { id: 'LINKEDIN',   label: 'LinkedIn',     placeholder: 'https://linkedin.com/in/username' },
  { id: 'PORTFOLIO',  label: 'Portfolio',    placeholder: 'https://myportfolio.com' },
  { id: 'LEETCODE',   label: 'LeetCode',     placeholder: 'https://leetcode.com/username' },
  { id: 'CODEFORCES', label: 'Codeforces',   placeholder: 'https://codeforces.com/profile/username' },
  { id: 'CODECHEF',   label: 'CodeChef',     placeholder: 'https://codechef.com/users/username' },
  { id: 'HACKERRANK', label: 'HackerRank',   placeholder: 'https://hackerrank.com/username' },
  { id: 'OTHER',      label: 'Other',        placeholder: 'https://...' },
];

export default function PortfolioInput({ links = [], onChange, error }) {
  // Normalize links input to objects array [{ platform, url }]
  const normalizedLinks = Array.isArray(links) && links.length > 0
    ? links.map((item) => {
        if (typeof item === 'string') {
          return { platform: 'GITHUB', url: item };
        }
        return { platform: item.platform || 'GITHUB', url: item.url || '' };
      })
    : [{ platform: 'GITHUB', url: '' }];

  const handlePlatformChange = (index, platform) => {
    const updated = [...normalizedLinks];
    updated[index] = { ...updated[index], platform };
    onChange(updated);
  };

  const handleUrlChange = (index, url) => {
    const updated = [...normalizedLinks];
    updated[index] = { ...updated[index], url };
    onChange(updated);
  };

  const handleAddLink = () => {
    // Suggest next platform if available
    const usedPlatforms = normalizedLinks.map((item) => item.platform);
    const nextPlatform = PLATFORM_OPTIONS.find((p) => !usedPlatforms.includes(p.id))?.id || 'Other';
    onChange([...normalizedLinks, { platform: nextPlatform, url: '' }]);
  };

  const handleRemoveLink = (index) => {
    if (normalizedLinks.length === 1) {
      onChange([{ platform: 'GITHUB', url: '' }]);
    } else {
      const updated = normalizedLinks.filter((_, i) => i !== index);
      onChange(updated);
    }
  };

  const getPlaceholder = (platform) => {
    const found = PLATFORM_OPTIONS.find((p) => p.id === platform);
    return found ? found.placeholder : 'https://...';
  };

  return (
    <div className="space-y-3 w-full">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-zinc-300">
          Portfolio & Social Profiles
        </label>
        <span className="text-[11px] text-zinc-500 font-normal">Optional</span>
      </div>

      <div className="space-y-2.5">
        {normalizedLinks.map((item, index) => (
          <div key={index} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Platform Select */}
            <div className="sm:w-44 shrink-0">
              <select
                value={item.platform}
                onChange={(e) => handlePlatformChange(index, e.target.value)}
                className="h-11 w-full bg-[#09080d] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-colors cursor-pointer"
              >
                {PLATFORM_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-[#110e17] text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* URL Input */}
            <div className="relative flex-1">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                <PlatformLogo platform={item.platform} className="w-4 h-4" />
              </div>
              <input
                type="url"
                value={item.url}
                onChange={(e) => handleUrlChange(index, e.target.value)}
                placeholder={getPlaceholder(item.platform)}
                className="h-11 w-full bg-[#09080d] border border-white/10 rounded-xl pl-10 pr-3.5 text-xs sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-colors"
              />
            </div>

            {/* Remove button */}
            {normalizedLinks.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveLink(index)}
                className="h-11 w-11 rounded-xl border border-white/10 bg-white/5 hover:bg-rose-500/10 hover:border-rose-500/30 text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer flex items-center justify-center shrink-0 self-end sm:self-auto"
                title="Remove profile"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddLink}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#c084fc] hover:text-purple-300 transition-colors cursor-pointer pt-1"
      >
        <Plus className="w-4 h-4" />
        <span>Add another platform</span>
      </button>

      {error && <p className="text-[11px] text-rose-400 font-medium">{error}</p>}
    </div>
  );
}

