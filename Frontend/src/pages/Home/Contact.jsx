import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, MessageSquare, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      toast.success("Thank you! Your message has been received. We will get back to you shortly.");
      setForm({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1200);
  };

  const contactDetails = [
    {
      icon: Mail,
      title: "Email Us",
      value: "support@codetier.com",
      sub: "Average response: under 2 hours",
      color: "text-[#c084fc] bg-[#2a1d3f]"
    },
    {
      icon: Phone,
      title: "Call Us",
      value: "+1 (555) 302-9843",
      sub: "Mon - Fri, 9 AM - 6 PM EST",
      color: "text-emerald-400 bg-emerald-950/50"
    },
    {
      icon: MapPin,
      title: "Global Headquarters",
      value: "100 Pine Street, Suite 1200",
      sub: "San Francisco, CA 94111",
      color: "text-blue-400 bg-blue-950/50"
    }
  ];

  return (
    <div className="bg-[#080808] text-white min-h-screen py-16 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c122e] border border-[#7c3aed]/30 text-xs font-semibold text-[#c084fc] tracking-wide uppercase">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Get in Touch</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Connect with our <span className="bg-gradient-to-r from-[#a855f7] to-[#eedcff] bg-clip-text text-transparent">Engineering Specialists</span>
          </h1>
          <p className="text-base text-purple-200/70 font-normal leading-relaxed">
            Have questions about enterprise setup, custom plans, or standard integrations? Fill out the form below and our team will follow up directly.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            {contactDetails.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-[#110e17] border border-white/10 shadow-xl flex items-start gap-4 hover:border-[#7c3aed]/30 transition-all text-left">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/5 ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">{item.title}</h3>
                    <div className="text-sm font-bold text-white">{item.value}</div>
                    <div className="text-[11px] text-white/40">{item.sub}</div>
                  </div>
                </div>
              );
            })}

            {/* Support Hours Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#130f1c] to-[#0a080f] border border-[#7c3aed]/10 text-left space-y-3">
              <h4 className="text-xs font-bold text-[#c084fc] uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Customer Support Hours
              </h4>
              <p className="text-xs text-purple-200/60 leading-relaxed font-normal">
                Our support desk is online 24/7 for critical tier-1 platform issues. General billing and integration inquiries are responded to during standard Business hours (EST).
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-[#110e17] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl text-left space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Send a Message</h2>
              <p className="text-xs text-white/50 mt-1">We typically reply within 1-2 business hours.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-white/70 block font-medium">Your Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Liam Stark"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    className="w-full bg-[#1c1728] border border-white/10 focus:border-[#7c3aed] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-[#7c3aed] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-white/70 block font-medium">Email Address <span className="text-red-500">*</span></label>
                  <input 
                    type="email"
                    required
                    placeholder="e.g. liam@company.com"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    className="w-full bg-[#1c1728] border border-white/10 focus:border-[#7c3aed] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-[#7c3aed] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-white/70 block font-medium">Subject</label>
                <input 
                  type="text"
                  placeholder="e.g. Enterprise pilot program inquiry"
                  value={form.subject}
                  onChange={(e) => setForm({...form, subject: e.target.value})}
                  className="w-full bg-[#1c1728] border border-white/10 focus:border-[#7c3aed] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-[#7c3aed] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-white/70 block font-medium">Message <span className="text-red-500">*</span></label>
                <textarea 
                  required
                  rows={5}
                  placeholder="Tell us about your technical hiring goals and challenges..."
                  value={form.message}
                  onChange={(e) => setForm({...form, message: e.target.value})}
                  className="w-full bg-[#1c1728] border border-white/10 focus:border-[#7c3aed] rounded-xl p-3.5 text-white focus:outline-none focus:ring-1 focus:ring-[#7c3aed] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:bg-[#7c3aed]/50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#7c3aed]/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
