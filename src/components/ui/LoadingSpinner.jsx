import { classNames } from '../../utils/helpers';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={classNames('animate-spin', sizes[size], className)}>
      <svg fill="none" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="m12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6v-4z"
        />
      </svg>
    </div>
  );
};

export default LoadingSpinner;