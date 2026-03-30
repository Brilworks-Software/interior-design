import { useNavigate } from 'react-router-dom';
import { Button } from '../components/components/ui/button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-indigo-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-2">Page Not Found</h2>
        <p className="text-neutral-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={() => navigate('/')}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Go Home
          </Button>
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
            className="border-neutral-600 text-white hover:bg-neutral-900"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
