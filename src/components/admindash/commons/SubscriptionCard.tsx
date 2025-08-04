// src/components/admindash/SubscriptionCard.tsx
import { format, differenceInCalendarDays } from 'date-fns';

interface SubscriptionCardProps {
  subscription: {
    id: number;
    user: { id: number; email: string } | null;
    startDate: string;
    endDate: string;
  };
  onEdit: (id: number) => void;
}

export default function SubscriptionCard({ subscription, onEdit }: SubscriptionCardProps) {
  const today = new Date();
  const startDate = new Date(subscription.startDate);
  const endDate = new Date(subscription.endDate);
  const daysLeft = differenceInCalendarDays(endDate, today);
  const expired = daysLeft <= 0;

  return (
    <div className="bg-white shadow rounded p-4 border relative">
      <div className="mb-2">
        <strong>User:</strong> {subscription.user?.email || 'No user assigned'}
      </div>
      <div className="text-sm text-gray-700">
        <p>
          <strong>Start:</strong> {format(startDate, 'yyyy-MM-dd')}
        </p>
        <p>
          <strong>End:</strong> {format(endDate, 'yyyy-MM-dd')}
        </p>
        <p>
          <strong>Days Left:</strong>{' '}
          <span className={expired ? 'text-red-500' : 'text-green-600'}>{daysLeft}</span>
        </p>
      </div>

      {expired && (
        <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
          Ended
        </span>
      )}

      <button
        onClick={() => onEdit(subscription.id)}
        className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
      >
        Edit
      </button>
    </div>
  );
}
