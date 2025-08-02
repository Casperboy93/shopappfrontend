import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../lib/axios';

const Contact = () => {
  const { t } = useTranslation();
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
      const msg = err.response?.data?.message || t('contact.errorMessage');
      setErrorMsg(Array.isArray(msg) ? msg[0] : msg);
      setStatus('error');
    }
  };

  const inputClass =
    'mt-1 block w-full px-4 py-3 bg-dark-800 border border-golden-600/30 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-golden-400 transition-colors';

  return (
    <div className="bg-dark-enhanced min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4">
          <span className="text-gradient-golden">{t('contact.title').split(' ')[0]}</span>{' '}
          <span className="text-white">{t('contact.title').split(' ')[1]}</span>
        </h1>
        <p className="text-center text-high-contrast mb-2">
          {t('contact.subtitle')}
        </p>
        <p className="text-center text-gray-300 mb-10">
          {t('contact.description')}
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-card-dark rounded-xl p-8 space-y-6 shadow-2xl"
        >
          {status === 'success' && (
            <div className="bg-emerald-900/50 text-emerald-bright border border-emerald-500/50 rounded-lg p-4 text-sm backdrop-blur">
              {t('contact.successMessage')}
            </div>
          )}

          {status === 'error' && (
            <div className="bg-red-900/50 text-red-300 border border-red-500/50 rounded-lg p-4 text-sm backdrop-blur">
              {errorMsg}
            </div>
          )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-high-contrast mb-2">
              {t('contact.fullName')}
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
            <label htmlFor="email" className="block text-sm font-medium text-high-contrast mb-2">
              {t('contact.email')}
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
            <label htmlFor="phone" className="block text-sm font-medium text-high-contrast mb-2">
              {t('contact.phoneOptional')}
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
            <label htmlFor="title" className="block text-sm font-medium text-high-contrast mb-2">
              {t('contact.subject')}
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
          <label htmlFor="message" className="block text-sm font-medium text-high-contrast mb-2">
            {t('contact.message')}
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={form.message}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-3 bg-dark-800 border border-golden-600/30 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-golden-400 transition-colors resize-none"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={status === 'loading'}
            className="btn-golden-enhanced px-8 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? t('contact.sending') : t('contact.sendMessage')}
          </button>
        </div>
      </form>

        <p className="mt-10 text-center text-sm text-gray-400">
          {t('contact.footerMessage')}
        </p>
      </div>
    </div>
  );
};

export default Contact;
