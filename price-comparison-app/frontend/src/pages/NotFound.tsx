import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main className="container">
      <h1>404</h1>

      <h2>Page not found</h2>

      <p>
        The page you are looking for does not exist.
      </p>

      <Link to="/register">
        Go to Registration
      </Link>
    </main>
  );
};

export default NotFound;