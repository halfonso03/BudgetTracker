import useGetRepro from '../../../api/hooks/repro/useGetRepro';
import { formatDate, formatNumber } from '../../../app/util';
import Button from '../../../components/Button';
import Modal2 from '../../../components/Modal2';

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  reproId: number;
  initiativeId: number;
  grantId: number;
  accountName: string;
};

const ReproMiniDetailsModal = ({ reproId, ...props }: Props) => {
  const { data, isSuccess } = useGetRepro(reproId);

  if (!isSuccess) return <div>Loading...</div>;

  return (
    <Modal2
      size="xl"
      title="Reprogramming Details"
      animateOut={false}
      {...props}
    >
      <div className="mt-2 mb-12 gap-4">
        <div className="mb-8">
          <div className="grid grid-cols-[.2fr_1fr] gap-4 mb-2">
            <div className="font-medium text-neutral-600 w-20">ID</div>
            <div className="font-medium">{data?.id}</div>
            <div className="font-medium text-neutral-600 w-20">Posted By</div>
            <div className="font-medium">{data?.postedBy}</div>
            <div className="font-medium text-neutral-600">Date</div>
            <div className="font-medium">
              {data?.postedDate && formatDate(data.postedDate)}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-[1.5fr_.7fr_.7fr_1fr_.5fr_.5fr] border-b mb-4 border-b-neutral-300">
          <div className="text-neutral-600 font-medium">Initiative</div>
          <div className="text-neutral-600 font-medium">Award</div>
          <div className="text-neutral-600 font-medium">Category</div>
          <div className="text-neutral-600 font-medium">Account</div>
          <div className="text-neutral-600 font-medium text-end">Increase</div>
          <div className="text-neutral-600 font-medium text-end">Decrease</div>
        </div>
        {data?.lineItems.map((item, index) => (
          <div
            key={index}
            className={`grid grid-cols-[1.5fr_.7fr_.7fr_1fr_.5fr_.5fr] mb-3 ${props.accountName == item.accountName && props.initiativeId === item.initiativeId && props.grantId === item.grantId ? 'font-medium' : ''} py-2 px-2`}
          >
            <div>{item.initiativeName}</div>
            <div>{item.grantName}</div>
            <div>{item.categoryName}</div>
            <div>{item.accountName}</div>
            <div className=" text-end">
              {+item.increase! > 0 && formatNumber(+item.increase!)}
            </div>
            <div className=" text-end">
              {+item.decrease! > 0 && formatNumber(+item.decrease!)}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-3 pb-3">
        <Button
          variation="secondary"
          onClick={() => {
            props.onCancel();
            // setAnimateOut(true);
            // setTimeout(() => {
            //   setAnimateOut(false);
            // }, 500);
          }}
        >
          Close
        </Button>
      </div>
    </Modal2>
  );
};
export default ReproMiniDetailsModal;
