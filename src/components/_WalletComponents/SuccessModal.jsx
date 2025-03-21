import Modal from "../ModalComponent";

const SuccessModal = ({ showModal, setShowModal }) => {
  return (
    <Modal
      isOpen={showModal}
      onRequestClose={() => setShowModal(false)}
      className="w-96"
    >
      <div className="p-4">
        <img src='/Illustration.png' alt="Success" />
        <h2 className="text-xl font-semibold mb-4">Payment Status</h2>
        <p className="text-center">
          Your payment was successful. Thank you for your patronage.
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