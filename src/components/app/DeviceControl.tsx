import { useState } from "react";
import { ConfirmationModal, Toggle } from "./ui";
import { useStore, type DeviceKey } from "@/lib/store";
import { deviceService } from "@/services/api";

const NAME: Record<DeviceKey, string> = { electricity: "electricity", gas: "gas", water: "water" };

/** Toggle wired to a confirmation modal + mock device service. */
export function useDeviceControl(device: DeviceKey) {
  const { devices, setDevice } = useStore();
  const on = devices[device];
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await deviceService.setPower(device, !on);
      setDevice(device, !on);
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to update device status.");
    } finally {
      setLoading(false);
    }
  };

  const modal = (
    <ConfirmationModal
      open={open}
      danger={on}
      title={on ? `Turn off ${NAME[device]}?` : `Turn on ${NAME[device]}?`}
      message={`Are you sure you want to turn ${on ? "off" : "on"} ${NAME[device]}?`}
      loading={loading}
      error={error}
      onCancel={() => { setOpen(false); setError(null); }}
      onConfirm={confirm}
    />
  );

  return { on, loading, request: () => { setError(null); setOpen(true); }, modal };
}

export function DeviceToggle({ device }: { device: DeviceKey }) {
  const c = useDeviceControl(device);
  return (
    <>
      <Toggle checked={c.on} onChange={c.request} disabled={c.loading} label={`Toggle ${device}`} />
      {c.modal}
    </>
  );
}
