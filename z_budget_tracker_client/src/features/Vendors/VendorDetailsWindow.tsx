import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';

type Props = {
  onClose: () => void;
  vendor: Vendor;
};

const VendorDetailsWindow = ({ vendor, onClose }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: vendor.name,     
      details: vendor.details 
    },
  });

  function onSubmit() {}

  return createPortal(
    <div className="w-full min-h-5/6 absolute top-20 z-1000 bg-white ">
      <div className="relative p-4">
        <div className="w-full flex justify-end">
          <X
            className="text-neutral-500 cursor-pointer hover:text-neutral-800"
            size={40}
            onClick={onClose}
          ></X>
        </div>
        <div className="w-[70%] mx-auto border">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="self-center animate-fade-in w-80"
          >
            <input type="text" {...register('name')} />
          </form>
        </div>
      </div>
    </div>,
    document.body,
  );
};
export default VendorDetailsWindow;
