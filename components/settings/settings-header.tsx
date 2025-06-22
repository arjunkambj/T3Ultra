export default function SettingsHeader() {
  return (
    <>
      <div className="flex items-center gap-x-3">
        <h1 className="text-3xl font-bold leading-9 text-default-foreground">
          Settings
        </h1>
      </div>
      <h2 className="mt-2 text-small text-default-500">
        Customize settings, email preferences, and web appearance.
      </h2>
    </>
  );
}
