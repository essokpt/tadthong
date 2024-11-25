"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/custom/button";
import { Modal } from "@/components/ui/modal";
//import { CustomerForm } from "@/pages/master/customer/components/customer-form";


interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  title: string|null
}

export const ApproveModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Are you sure?"
      description={`Confirm to send approval : ${title} ?`}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
      
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button loading={loading} variant="destructive" onClick={onConfirm}>
          Continue
        </Button>
      </div>
    </Modal>
  );
};