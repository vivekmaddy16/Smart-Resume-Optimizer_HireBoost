import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineMail,
  HiOutlineLocationMarker,
  HiOutlineChatAlt2,
  HiOutlinePaperAirplane,
  HiOutlineCheckCircle,
  HiOutlineUser,
} from 'react-icons/hi';
import { FaGithub, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const contactMethods = [
  {
    icon: HiOutlineMail,
    title: 'Email',
    value: 'vivekmaddheshiya19@gmail.com',
    href: 'mailto:vivekmaddheshiya19@gmail.com',
    description: 'Send us an email anytime',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  {
    icon: FaGithub,
    title: 'GitHub',
    value: 'github.com/vivekmaddy16',
    href: 'https://github.com/vivekmaddy16',
    description: 'Check out our open-source work',
    iconBg: 'bg-charcoal-100',
    iconColor: 'text-charcoal-600',
  },
  {
    icon: FaLinkedinIn,
    title: 'LinkedIn',
    value: 'linkedin.com/in/vivekm007',
    href: 'https://www.linkedin.com/in/vivekm007',
    description: 'Connect professionally',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    icon: FaXTwitter,
    title: 'X (Twitter)',
    value: '@vivekmaddy16',
    href: 'https://x.com/vivekmaddy16',
    description: 'Follow for updates',
    iconBg: 'bg-charcoal-100',
    iconColor: 'text-charcoal-600',
  },
];

export default function Contact() {
  const MotionDiv = motion.div;
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');

    try {
      const response = await fetch('https://formspree.io/f/xkoegkly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          _subject: formData.subject || 'HireBoost Contact Form',
          message: formData.message,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const data = await response.json();
        setError(data?.errors?.map((err) => err.message).join(', ') || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="relative py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium mb-6">
            <HiOutlineChatAlt2 className="w-4 h-4" />
            Get In Touch
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-charcoal-900 mb-4">
            Contact <span className="gradient-text">Us</span>
          </h1>
          <p className="text-charcoal-500 text-lg max-w-2xl mx-auto">
            Have a question, suggestion, or just want to say hello? We'd love to hear from you.
          </p>
        </MotionDiv>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact methods */}
          <MotionDiv
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 space-y-4"
          >
            <h2 className="font-display text-lg font-semibold text-charcoal-800 mb-5">Reach out via</h2>
            {contactMethods.map(({ icon: Icon, title, value, href, description, iconBg, iconColor }, index) => (
              <MotionDiv
                key={title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
              >
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 p-4 rounded-2xl bg-white border border-warm-border hover:border-amber-300 hover:shadow-md transition-all duration-300"
                >
                  <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-charcoal-800 text-sm">{title}</h3>
                    <p className="text-amber-600 text-sm truncate">{value}</p>
                    <p className="text-charcoal-400 text-xs mt-0.5">{description}</p>
                  </div>
                </a>
              </MotionDiv>
            ))}

            {/* Location */}
            <MotionDiv
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-warm-bg border border-warm-border"
            >
              <HiOutlineLocationMarker className="w-5 h-5 text-charcoal-400" />
              <span className="text-charcoal-500 text-sm">India 🇮🇳</span>
            </MotionDiv>
          </MotionDiv>

          {/* Contact form */}
          <MotionDiv
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="warm-card p-8">
              {submitted ? (
                <MotionDiv
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-5">
                    <HiOutlineCheckCircle className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-charcoal-800 mb-2">Message Sent! 🎉</h3>
                  <p className="text-charcoal-500 text-sm mb-6">
                    Thank you for reaching out! We'll get back to you as soon as possible.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}
                    className="text-amber-600 hover:text-amber-700 text-sm font-medium transition-colors"
                  >
                    Send another message →
                  </button>
                </MotionDiv>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-charcoal-800 mb-1">Send a Message</h2>
                    <p className="text-charcoal-400 text-sm mb-6">Fill out the form below and we'll get back to you.</p>
                  </div>

                  {error && (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm">
                      ⚠️ {error}
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-medium text-charcoal-700 mb-2">Name</label>
                      <div className="relative">
                        <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
                        <input
                          id="contact-name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          className="input-field pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-medium text-charcoal-700 mb-2">Email</label>
                      <div className="relative">
                        <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          className="input-field pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-sm font-medium text-charcoal-700 mb-2">Subject</label>
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What's this about?"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-medium text-charcoal-700 mb-2">Message</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows="5"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us what's on your mind..."
                      className="input-field resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-amber w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {sending ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <HiOutlinePaperAirplane className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </MotionDiv>
        </div>

        {/* Back link */}
        <div className="mt-12 text-center">
          <Link to="/" className="text-charcoal-400 hover:text-amber-600 text-sm font-medium transition-colors duration-200">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
