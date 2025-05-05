
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="container mx-auto py-16 px-4 text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <div className="h-1 w-24 bg-primary mx-auto my-4"></div>
        </div>
        
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
          We couldn't find the page you're looking for. The page may have been moved or doesn't exist.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/">Back to Home</Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link to="/services">Browse Services</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
