'use client';
import { useState } from 'react';
import EditItemForm from './edit-item-form';
import ReactModal from 'react-modal';
import { HiX } from 'react-icons/hi';

export default function EditCartModal() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <ReactModal
      shouldFocusAfterRender={false}
      style={{
        content: {
          paddingTop: '24px',
          paddingBottom: '20px'
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.2)' // Adjust opacity as needed
        }
      }}
      className="mx-auto mt-60   w-1/3 rounded-lg bg-white p-8 shadow-2xl"
      isOpen={modalIsOpen}
      onRequestClose={() => setModalIsOpen(false)}
    >
      <HiX
        className="rounded-full bg-black p-1 text-3xl text-white hover:bg-green-500"
        style={{
          float: 'right',
          cursor: 'pointer',
          marginTop: '-1.75rem',
          marginRight: '-2.2rem'
        }}
        onClick={() => setModalIsOpen(false)}
      />
      <EditItemForm />
    </ReactModal>
  );
}
