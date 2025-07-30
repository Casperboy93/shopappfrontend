import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaPhoneAlt, FaMapMarkerAlt, FaStar, FaEye } from 'react-icons/fa';
import api from '../lib/axios';

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api
      .get(`/users/${id}`)
      .then((res) => {
        setUser(res.data);
        setNotFound(false);
      })
      .catch((err) => {
        console.error(err);
        setUser(null);
        setNotFound(true);
      });
  }, [id]);

  if (notFound) {
    return <p className="text-center text-red-400 mt-10">This user is not subscribed or doesn’t exist.</p>;
  }

  if (!user) {
    return <p className="text-center mt-10 text-white">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-3xl mx-auto backdrop-blur bg-white/10 border border-white/20 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 bg-white/5">
          {/* Profile Image */}
          {user.profileImg ? (
            <img
              src={user.profileImg}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-32 h-32 rounded-full border border-white object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full border border-white bg-gray-800 flex items-center justify-center text-white/50">
              No Image
            </div>
          )}

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-yellow-400">
              {user.firstName} {user.lastName}
            </h2>

            <div className="flex items-center gap-2 mt-1 text-white/80 text-sm">
              <FaMapMarkerAlt className="text-yellow-400" />
              <span>{user.city}</span>
            </div>

            <div className="mt-2 inline-block bg-yellow-400 text-black text-xs font-medium px-4 py-1 rounded-full">
              {user.job}
            </div>

            <div className="flex items-center gap-2 text-yellow-300 mt-3 text-sm">
              <FaStar />
              <span>{user.rating} / 5.0</span>
            </div>

            <div className="text-white/60 text-xs mt-1">
              <FaEye className="inline-block mr-1" />
              Views: {user.views} &bull; Phone Views: {user.phoneViews}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-6 border-t border-white/20 text-sm text-white/90 leading-relaxed">
          {user.description}
        </div>

        {/* Contact */}
        <div className="p-6 border-t border-white/20 bg-white/5 flex justify-end">
          {user.phone ? (
            <button
              onClick={() => alert(`Calling ${user.phone}`)}
              className="flex items-center gap-2 bg-yellow-400 text-black px-5 py-2 rounded-md text-sm font-semibold hover:bg-white hover:text-yellow-500 transition"
            >
              <FaPhoneAlt />
              Contact: {user.phone}
            </button>
          ) : (
            <span className="text-white/50 italic text-sm">Phone not public</span>
          )}
        </div>
      </div>
    </div>
  );
}
