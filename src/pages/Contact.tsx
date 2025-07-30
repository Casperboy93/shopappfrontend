import { useState } from 'react';
import api from '../lib/axios';

const Contact = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    title: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      await api.post('/support', form);
      setStatus('success');
      setForm({
        fullName: '',
        email: '',
        phone: '',
        title: '',
        message: '',
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setErrorMsg(Array.isArray(msg) ? msg[0] : msg);
      setStatus('error');
    }
  };

  const inputClass =
    'mt-1 block w-full px-4 py-2 border-b-2 border-gray-300 focus:border-blue-600 outline-none bg-transparent';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">Contact Support</h1>
      <p className="text-center text-gray-600 mb-2">
        Need help or have a question? Reach out to us using the form below.
      </p>
      <p className="text-center text-gray-500 mb-10">
        Our team will carefully review your message and get back to you as soon as possible.
        We’re here to assist you with any concerns, feedback, or support you may need.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-xl p-8 space-y-6 border border-gray-100"
      >
        {status === 'success' && (
          <div className="bg-green-100 text-green-800 border border-green-300 rounded p-3 text-sm">
            Message sent successfully! Our team will get back to you soon.
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-100 text-red-800 border border-red-300 rounded p-3 text-sm">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone (optional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Subject
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={form.message}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring-yellow-500 focus:border-slate-500"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-gray-600 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
          >
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>

      <p className="mt-10 text-center text-sm text-gray-500">
        Once your message is received, our team will prioritize it and respond accordingly.
        We appreciate your trust and will make sure your concerns are addressed with care.
      </p>
    </div>
  );
};

export default Contact;
