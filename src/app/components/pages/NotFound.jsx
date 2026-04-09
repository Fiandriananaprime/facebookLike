import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Home } from "lucide-react";
function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
            <Home className="w-4 h-4" />
            Go Back Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
export { NotFound };
