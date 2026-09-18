import useGetRepro from '../../../api/hooks/repro/useGetRepro';
import { formatDate, formatNumber } from '../../../app/util';
import Button from '../../../components/Button';
import Modal2 from '../../../components/Modal2';

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  reproId: number;
  initiativeId: number;
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
          <div className="flex gap-4 mb-2">
            <div className="font-semibold text-neutral-600 w-20">ID</div>
            <div className="font-semibold">{data?.id}</div>
          </div>
          <div className="flex gap-10">
            <div className="flex gap-4">
              <div className="font-semibold text-neutral-600 w-20">
                Posted By
              </div>
              <div className="font-semibold">{data?.postedBy}</div>
            </div>

            <div className="flex gap-4">
              <div className="font-semibold text-neutral-600">Date</div>
              <div className="font-semibold">
                {data?.postedDate && formatDate(data.postedDate)}
              </div>
            </div>
          </div>
          <div className="flex gap-6"></div>
        </div>
        <div className="grid grid-cols-[1.5fr_.7fr_.7fr_1fr_.5fr_.5fr] border-b mb-4 border-b-neutral-300">
          <div className="text-neutral-600 font-semibold">Initiative</div>
          <div className="text-neutral-600 font-semibold">Award</div>
          <div className="text-neutral-600 font-semibold">Category</div>
          <div className="text-neutral-600 font-semibold">Account</div>
          <div className="text-neutral-600 font-semibold text-end">
            Increase
          </div>
          <div className="text-neutral-600 font-semibold text-end">
            Decrease
          </div>
        </div>
        {data?.lineItems.map((item, index) => (
          <div
            key={index}
            className={`grid grid-cols-[1.5fr_.7fr_.7fr_1fr_.5fr_.5fr] mb-3 ${props.accountName == item.accountName ? 'bg-neutral-100' : ''} py-2 px-2`}
          >
            <div>{item.initiativeName}</div>
            <div>{item.grantName}</div>
            <div>{item.categoryName}</div>
            <div
              className={``}
            >
              {item.accountName}
            </div>
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
