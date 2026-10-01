import Switch from "../../components/Switch";

type Props = {
  vendor: Vendor;
};

const Edit = ({ vendor }: Props) => {
  return (
    <div>
      <div></div>
      <div>
        <Switch
          isOn={vendor.isActive}
          handleToggle={() => {
            // handleVendorToggle(v.id);
          }}
        ></Switch>
      </div>
    </div>
  );
};
export default Edit;
