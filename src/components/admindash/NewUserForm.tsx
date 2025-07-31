// src/components/admindash/NewUserForm.tsx
import { useEffect, useState } from 'react';
import api from '../../lib/axios';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  job: string;
}

export default function NewUserForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    dob: '',
    city: '',
    address: '',
    profileImg: '',
    portfolio: '',
    job: '',
    description: '',
    role: 'USER',
    status: 'active',
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: string[] = [];
    if (!formData.firstName) newErrors.push('First Name is required.');
    if (!formData.lastName) newErrors.push('Last Name is required.');
    if (!formData.email) newErrors.push('Email is required.');
    if (!formData.password) newErrors.push('Password is required.');
    if (!formData.phone) newErrors.push('Phone is required.');
    if (!formData.dob) newErrors.push('Date of Birth is required.');
    if (!formData.city) newErrors.push('City is required.');
    if (!formData.address) newErrors.push('Address is required.');
    if (!formData.job) newErrors.push('Job is required.');
    if (!formData.description) newErrors.push('Description is required.');
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    console.log('New User to Create:', {
      ...formData,
      role: 'USER',
      status: 'active',
    });
    setSubmitted(true);
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <section className="bg-white shadow rounded-lg p-4 mb-6">
      <h2 className="text-xl font-semibold mb-4">Add New User (Directly Approved)</h2>

      {submitted ? (
        <div className="bg-green-100 border border-green-300 text-green-700 p-4 rounded mb-4">
          ✅ User has been created (console.log only for now)!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          {errors.length > 0 && (
            <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded">
              <ul className="list-disc pl-5">
                {errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Form Inputs */}
          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="border rounded px-3 py-2" required />
            <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="border rounded px-3 py-2" required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="border rounded px-3 py-2" required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="border rounded px-3 py-2" required />
            <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="border rounded px-3 py-2" required />
            <input type="date" name="dob" placeholder="Date of Birth" value={formData.dob} onChange={handleChange} className="border rounded px-3 py-2" required />
            <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="border rounded px-3 py-2" required />
            <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="border rounded px-3 py-2" required />
          </div>

          <input type="text" name="job" placeholder="Job Title" value={formData.job} onChange={handleChange} className="border rounded px-3 py-2 w-full" required />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="border rounded px-3 py-2 w-full" rows={3} required />

          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" name="profileImg" placeholder="Profile Image URL (optional)" value={formData.profileImg} onChange={handleChange} className="border rounded px-3 py-2" />
            <input type="text" name="portfolio" placeholder="Portfolio URL (optional)" value={formData.portfolio} onChange={handleChange} className="border rounded px-3 py-2" />
          </div>

          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Add User</button>
        </form>
      )}

      {/* User List */}
      <h3 className="text-lg font-semibold mb-2">Existing Users</h3>
      {users.length === 0 ? (
        <p className="text-gray-500 italic">No users found.</p>
      ) : (
        <ul className="divide-y">
          {users.map((u) => (
            <li key={u.id} className="py-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">{u.firstName} {u.lastName}</span>
                <span className="text-sm text-gray-500">{u.email} — {u.job} ({u.city})</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
