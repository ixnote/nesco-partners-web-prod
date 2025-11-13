import { BellIcon } from "lucide-react";
import * as React from "react";

export type DashboardHeaderProps = {
  heading: string;
  byText: string;
  onToggleSidebar: () => void;
};

export const DashboardHeader = ({
  heading,
  byText,
  onToggleSidebar,
}: DashboardHeaderProps) => {
  return (
    <header className="sticky top-0 z-10 border-b border-brand-border-light bg-brand-white/90 px-4 py-4 backdrop-blur-lg lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand-border-light bg-brand-white text-lg font-semibold text-brand-main shadow-sm shadow-brand-black/5 transition hover:bg-brand-light-bg lg:hidden"
          >
            ☰
          </button>
          <div>
            <h1 className="text-base font-medium text-brand-black lg:text-lg">
              {heading}
            </h1>
            <p className="text-xs text-brand-ash lg:text-sm">{byText}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden group relative items-center gap-3 rounded-full cursor-pointer border border-brand-border-light bg-brand-white px-4 py-2 text-sm text-brand-ash shadow-sm shadow-brand-black/5 hover:bg-brand-light-bg md:flex">
            <BellIcon className="h5 w5" />
            <span className="absolute top-2 right-4 w-2 h-2 bg-brand-failed-text rounded-full"></span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-main text-brand-white">
            AU
          </div>
          <div className="hidden lg:block">
            <h1 className="text-sm font-normal text-brand-black lg:text-base">
              Admin User
            </h1>
            <p className="text-xs text-brand-ash lg:text-sm">admin@gmail.com</p>
          </div>
        </div>
      </div>
    </header>
  );
};
