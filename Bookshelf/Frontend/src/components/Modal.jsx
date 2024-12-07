import PropTypes from "prop-types";
import { useContext } from "react";
import { ThemeContext } from "../components/ThemeContext";

const Modal = ({ isOpen, onClose, children }) => {
  const { theme } = useContext(ThemeContext);
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ${ theme === "dark" ? "bg-gray-800 text-white"
          : "bg-gray-100 text-gray-800"}`}>
      <div className="bg-white p-4 rounded shadow-md">
        <button onClick={onClose} className="text-red-500 float-right">
          &#x2715;
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default Modal;
