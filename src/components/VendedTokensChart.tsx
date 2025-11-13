import * as React from "react";
import { ChevronDown } from "lucide-react";

const chartData = [
  { month: "Jan", value: 28 },
  { month: "Feb", value: 45 },
  { month: "Mar", value: 40 },
  { month: "Apr", value: 58 },
  { month: "May", value: 20 },
  { month: "Jun", value: 75 },
  { month: "Jul", value: 18 },
  { month: "Aug", value: 68 },
  { month: "Sep", value: 85 },
  { month: "Oct", value: 52 },
  { month: "Nov", value: 35 },
  { month: "Dec", value: 70 },
];

export const VendedTokensChart = () => {
  const maxValue = Math.max(...chartData.map((d) => d.value));

  return (
    <div className="rounded-2xl border border-brand-border-light bg-brand-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-brand-black">
            Vended Tokens
          </h3>
          <p className="text-xs text-brand-ash">
            Latest transactions with Partner
          </p>
        </div>
        <button
          type="button"
          className="transition-fx flex items-center gap-2 rounded-lg border border-brand-border-light bg-brand-white px-3 py-2 text-xs font-medium text-brand-ash hover:border-brand-main hover:text-brand-main"
        >
          Last 12 months
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      <div className="mt-8 relative h-64">
        <div className="absolute inset-0 flex items-end justify-between gap-2 px-2">
          {chartData.map((data) => {
            const height = (data.value / maxValue) * 100;
            return (
              <div
                key={data.month}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div className="relative w-full flex-1 flex items-end">
                  <div
                    className="w-full rounded-t-md bg-brand-main/20 relative group cursor-pointer transition-all hover:bg-brand-main/30"
                    style={{ height: `${height}%` }}
                  >
                    <div
                      className="absolute bottom-0 w-full rounded-t-md bg-brand-main transition-all"
                      style={{ height: "100%" }}
                    />
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="rounded bg-brand-black px-2 py-1 text-[10px] text-brand-white whitespace-nowrap">
                        {data.value}
                      </div>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-brand-ash">{data.month}</span>
              </div>
            );
          })}
        </div>

        <div className="absolute left-0 top-0 flex h-full flex-col justify-between text-[10px] text-brand-ash">
          <span>100</span>
          <span>80</span>
          <span>60</span>
          <span>40</span>
          <span>20</span>
          <span>0</span>
        </div>

        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[0, 20, 40, 60, 80, 100].map((val) => (
            <div
              key={val}
              className="h-px bg-brand-border-light/50"
              style={{ marginLeft: "24px" }}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-brand-main" />
          <span className="text-xs text-brand-ash">Vended Tokens</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border-2 border-brand-main bg-brand-white" />
          <span className="text-xs text-brand-ash">Revenue</span>
        </div>
      </div>
    </div>
  );
};
