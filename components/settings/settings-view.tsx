import * as React from "react";

import SettingsContent from "@/components/settings/settings-content";

export default function SettingsView() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-4 mt-14 w-full max-w-3xl md:mt-10">
        <SettingsContent />
      </div>
    </div>
  );
}
