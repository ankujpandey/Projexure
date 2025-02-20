import React from 'react'
import ReactDOM from 'react-dom';
import Header from '../Header';
import { X } from 'lucide-react';

type Props = {
    children: React.ReactNode;
    isOpen: boolean;
    name: string;
    onClose?: () => void;
}

const Modal = ({
    children,
    isOpen,
    name,
    onClose
}: Props) => {
    if(!isOpen) return null; 
    return (
        ReactDOM.createPortal(
            <div className="fixed inset-0 z-50 flex h-full items-center justify-center overflow-y-auto bg-gray-600 bg-opacity-50 p-4">
                <div className="w-full max-w-2xl rounded-lg bg-white p-4 shadow-lg dark:bg-dark-secondary">
                    <Header 
                        name={name}
                        buttonComponent={
                            onClose && (
                                <button 
                                    className='flex h-7 w-7 items-center justify-center rounded-full text-gray-900 dark:text-white hover:bg-gray-400'
                                    onClick={onClose}    
                                >
                                    <X size={18} />
                                </button>
                            )
                        }
                        isSmalltext
                    />
                    {children}
                </div>
            </div>,
            document.body
        )
    )
}

export default Modal