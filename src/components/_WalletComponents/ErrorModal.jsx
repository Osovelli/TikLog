import { XCircleIcon } from "lucide-react";
import Modal from "../ModalComponent";

const ErrorModal = ({ showModal, setShowModal }) => {
  return (
    <Modal
      isOpen={showModal}
      onRequestClose={() => setShowModal(false)}
      className="w-96"
    >
      <div className="p-4">
        <XCircleIcon size={48} className="text-red-500 mx-auto" />  
        <h2 className="text-xl font-semibold mb-4">Payment Status</h2>
        <p className="text-center">
          Your payment was failed. Please try again.
        </p>
        <button
          onClick={() => setShowModal(false)}
          className="mt-6 w-full py-2 bg-blue-500 text-white rounded-lg"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}