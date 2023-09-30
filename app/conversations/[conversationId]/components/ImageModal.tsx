"use client";

import { Modal } from "@/app/components";
import Image from "next/image";

type ImageModalProps = {
  src?: string | null;
  isOpen?: boolean;
  onClose: () => void;
};

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, src }) => {
  if (!src) return null;
  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <div className="h-80 w-80">
        <Image alt="image" src={src} fill className="object-contain" />
      </div>
    </Modal>
  );
};

export default ImageModal;
