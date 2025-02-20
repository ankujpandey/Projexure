import React from 'react'
import Modal from '../Modal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
};

function ModalConfirm({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete",
  message = "Are you sure you want to delete?",
  confirmText = "Yes",
  cancelText = "No",
}: Props) {
    return (
      <Modal isOpen={isOpen} name={title}>
        <div className="py-1">
          <p className="mb-3 text-lg text-gray-700 dark:text-gray-200">{message}</p>
          <div className="flex justify-end gap-2">
            <button
              className="rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              onClick={onClose}
            >
              {cancelText}
            </button>
            <button
              className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </Modal>
    );
};
export default ModalConfirm