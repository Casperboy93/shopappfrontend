import {
    FaStar,
    FaEye,
    FaPhoneAlt,
    FaInfoCircle,
    FaArrowRight,
    FaUserCircle,
  } from 'react-icons/fa';
  import { useNavigate } from 'react-router-dom';
  
  interface User {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    city: string;
    job: string;
    rating: number;
    views: number;
    phoneViews: number;
    description: string;
    profileImg?: string;
  }
  
  interface Props {
    user: User;
  }
  
  export default function UserCard({ user }: Props) {
    const navigate = useNavigate();
  
    const handleDetailsClick = () => {
      navigate(`/user/${user.id}`);
    };
  
    return (
      <div className="w-full sm:w-64 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.01] text-white">
        {/* Image */}
        <div className="h-36 bg-gray-100 relative overflow-hidden">
          {user.profileImg ? (
            <img
              src={user.profileImg}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-6xl">
              <FaUserCircle />
            </div>
          )}
        </div>
  
        {/* Content */}
        <div className="p-4 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold truncate">
                {user.firstName} {user.lastName}{' '}
              </h3>
              <p className="text-sm text-white/60">{user.city}</p>
            </div>
            <div className="flex items-center gap-1 text-yellow-400 bg-yellow-100/10 px-2 py-1 rounded-full text-sm">
              <FaStar />
              {user.rating}
            </div>
          </div>
  
          <div className="text-sm text-yellow-300 bg-yellow-100/10 px-2 py-1 rounded-full inline-block w-fit">
            {user.job}
          </div>
  
          <div className="flex justify-between text-xs text-white/70">
            <div className="flex items-center gap-1">
              <FaEye /> {user.views}
            </div>
            <div className="flex items-center gap-1">
              <FaPhoneAlt /> {user.phoneViews}
            </div>
          </div>
  
          <div className="flex gap-1 text-xs text-white/80 mt-1">
            <FaInfoCircle className="mt-0.5 text-yellow-300" />
            <p className="line-clamp-2">{user.description}</p>
          </div>
  
          <button
            onClick={handleDetailsClick}
            className="mt-3 w-full flex justify-center items-center gap-2 bg-yellow-400 text-black px-3 py-2 rounded-md text-sm hover:bg-white hover:text-yellow-500 transition-colors font-semibold"
          >
            Details <FaArrowRight className="text-sm" />
          </button>
        </div>
      </div>
    );
  }
  