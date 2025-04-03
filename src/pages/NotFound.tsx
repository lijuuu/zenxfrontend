import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 dark:from-zinc-900 dark:to-zinc-950">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-green-500 mb-4">404</h1>
        <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          It seems you’ve hit a broken link or entered a URL that doesn’t exist.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300"
        >
          <a href="/">Return to Home</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;