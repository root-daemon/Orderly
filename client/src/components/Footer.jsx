import { Link } from "react-router";

const Footer = () => {
  return (
    <nav className="flex z-50 sm:flex-row justify-center items-center gap-4  w-full h-fit py-4 sm:gap-6">
      <Link to="/privacy-policy">
        <p className="text-xs">Privacy Policy</p>
      </Link>
      <Link to="/terms-of-service">
        <p className="text-xs">Terms of Service</p>
      </Link>
    </nav>
  );
};

export default Footer;
