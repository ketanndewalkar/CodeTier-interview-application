import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

export default function SkillSelector({ skills = [], onChange, error, required = false }) {
  const [inputValue, setInputValue] = useState('');

  const handleAddSkill = (e) => {
    if (e) e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    if (!skills.includes(trimmed)) {
      const updated = [...skills, trimmed];
      onChange(updated);
    }
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = skills.filter((s) => s !== skillToRemove);
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-white/80 block">
        Required Skills {required && <span className="text-rose-400">*</span>}
      </label>

      {/* Input row */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. React.js, Node.js, Docker"
          className={`flex-1 h-10 px-3.5 bg-[#181424] border ${
            error ? 'border-rose-500/80 focus:border-rose-500' : 'border-white/10 focus:border-[#6C4F91]'
          } rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none transition-all`}
        />
        <button
          type="button"
          onClick={handleAddSkill}
          className="px-4 py-2 bg-[#2d1f47] hover:bg-[#3d2a60] border border-[#6C4F91]/40 text-[#c084fc] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Tag Display */}
      <div className="flex flex-wrap gap-2 pt-1 min-h-[36px]">
        {skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#25183e] border border-[#6C4F91]/50 text-purple-200 text-xs font-medium rounded-lg shadow-sm"
          >
            <span>{skill}</span>
            <button
              type="button"
              onClick={() => handleRemoveSkill(skill)}
              className="p-0.5 rounded-md hover:bg-white/20 text-white/60 hover:text-white transition-colors cursor-pointer"
              aria-label={`Remove ${skill}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {skills.length === 0 && (
          <p className="text-xs text-white/30 italic py-1">No skills added yet. Type a skill above and press Enter or Add Skill.</p>
        )}
      </div>

      {error && <p className="text-[11px] text-rose-400 font-medium">{error}</p>}
    </div>
  );
}
