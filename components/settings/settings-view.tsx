import SettingsContent from "@/components/settings/settings-content";

export default function SettingsView() {
  return (
    <div className="relative h-full overflow-y-auto">
      <div className="mx-4 mt-14 w-full max-w-3xl pr-5 md:mt-10">
        <SettingsContent />
      </div>
    </div>
  );
}
