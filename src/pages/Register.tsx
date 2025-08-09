import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../lib/axios';
import { MOROCCAN_CITIES } from '../consts/cities';
import {  useTranslatedJobTypes } from '../consts/jobs';

interface RegistrationFormData {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  address: string;
  profileImg?: string;
  portfolio?: string;
  job: string;
  description: string;
}

export default function Register() {
  const { t } = useTranslation();
  const translatedJobTypes = useTranslatedJobTypes();
  const [formData, setFormData] = useState<RegistrationFormData>({
    firstName: '',
    lastName: '',
    phone: '',
    city: '',
    address: '',
    profileImg: '',
    portfolio: '',
    job: '',
    description: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // Format phone number as user types
      const formatted = formatPhoneNumber(value);
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as XX XX XX XX XX
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4)}`;
    if (digits.length <= 8) return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6)}`;
    return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
  };

  const validate = () => {
    const newErrors: string[] = [];

    if (!formData.firstName) newErrors.push(t('register.validation.firstNameRequired'));
    if (!formData.lastName) newErrors.push(t('register.validation.lastNameRequired'));
    if (!formData.phone) newErrors.push(t('register.validation.phoneRequired'));
    if (!formData.city) newErrors.push(t('register.validation.cityRequired'));
    if (!formData.address) newErrors.push(t('register.validation.addressRequired'));
    if (!formData.job) newErrors.push(t('register.validation.jobRequired'));
    if (!formData.description) newErrors.push(t('register.validation.descriptionRequired'));

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setErrors([]);
      setLoading(true);
      await api.post('/registration-requests', formData);
      setSubmitted(true);
    } catch (error: any) {
      if (error.response?.data?.message) {
        const message = error.response.data.message;
        setErrors(Array.isArray(message) ? message : [message]);
      } else {
        setErrors([t('register.somethingWentWrong')]);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'border-0 border-b-2 border-gray-300 focus:border-yellow-400 outline-none px-3 py-2 w-full bg-transparent text-black placeholder:text-gray-500';
  
  const selectClass =
    'border-0 border-b-2 border-gray-300 focus:border-yellow-400 outline-none px-3 py-2 w-full bg-transparent text-black';

  return (
    <div className="max-w-3xl mx-auto p-6 text-black">
      <h1 className="text-3xl font-bold text-center mb-4">
        <span className="text-yellow-400">{t('register.title')}</span>
      </h1>
      <p className="text-center text-gray-600 mb-6">
        {t('register.subtitle')}
      </p>

      {submitted ? (
        <div className="bg-green-100 border border-green-300 text-green-700 p-4 rounded text-center font-medium">
          {t('register.success')}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
          {errors.length > 0 && (
            <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded">
              <ul className="list-disc pl-5">
                {errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <input 
              type="text" 
              name="firstName" 
              placeholder={t('register.firstName')} 
              value={formData.firstName} 
              onChange={handleChange} 
              className={inputClass} 
            />
            <input 
              type="text" 
              name="lastName" 
              placeholder={t('register.lastName')} 
              value={formData.lastName} 
              onChange={handleChange} 
              className={inputClass} 
            />
            <input 
              type="text" 
              name="phone" 
              placeholder={`${t('register.phone')} (ex: 06 69 12 50 45)`}
              value={formData.phone} 
              onChange={handleChange} 
              className={inputClass}
              maxLength={14}
            />
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="">{t('register.selectCity')}</option>
              {MOROCCAN_CITIES.map((cityKey) => (
                <option key={cityKey} value={t(cityKey)}>
                  {t(cityKey)}
                </option>
              ))}
            </select>
            <input 
              type="text" 
              name="address" 
              placeholder={t('register.address')} 
              value={formData.address} 
              onChange={handleChange} 
              className={inputClass} 
            />
          </div>

          <select
            name="job"
            value={formData.job}
            onChange={handleChange}
            className={selectClass}
          >
            <option value="">{t('register.selectJob')}</option>
            {translatedJobTypes.map((job) => (
              <option key={job} value={job}>
                {job}
              </option>
            ))}
          </select>

          <textarea
            name="description"
            placeholder={t('register.description')}
            value={formData.description}
            onChange={handleChange}
            className="border-b-2 border-gray-300 focus:border-yellow-400 outline-none px-3 py-2 w-full bg-transparent text-black placeholder:text-gray-500"
            rows={4}
          />

          <div className="grid md:grid-cols-2 gap-4">
            <input 
              type="text" 
              name="profileImg" 
              placeholder={t('register.profileImage')} 
              value={formData.profileImg} 
              onChange={handleChange} 
              className={inputClass} 
            />
            <input 
              type="text" 
              name="portfolio" 
              placeholder={t('register.portfolio')} 
              value={formData.portfolio} 
              onChange={handleChange} 
              className={inputClass} 
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="bg-yellow-400 text-black px-6 py-2 rounded hover:bg-black hover:text-yellow-400 border border-yellow-400 transition w-full font-semibold"
          >
            {loading ? t('register.submitting') : t('register.submit')}
          </button>
        </form>
      )}

      {!submitted && (
        <p className="mt-6 text-center text-sm text-gray-500">
          {t('register.reviewMessage')}
        </p>
      )}
    </div>
  );
}
