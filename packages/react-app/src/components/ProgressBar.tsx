import React from "react";
import { useAppSelector } from "../hooks";

export default function ProgressBar() {
  const parcels = useAppSelector(state => state.parcels.parcels);
  const percent_sold = Math.floor((parcels.filter(parcel => parcel.sold).length / parcels.length) * 100);
  return (
    <div className="header w-full bg-primary h-12 z-10 text-gray-1 flex items-center justify-center text-base primary-font font-semibold">
      {percent_sold < 100 ? "Parcel 0 sale is live!" : "Parcel 0 sale is sold out!"}
      {percent_sold < 100 ? (
        <div className="ml-12 bg-primary flex text-gray-1 items-center text-sm font-normal secondary-font">
          <div className="progress-bar w-40 bg-gray-9 rounded-full h-2 mx-2">
            <div className="progress-bar-fill bg-primary-4 rounded-full h-full" style={{ width: `${percent_sold}%` }} />
          </div>
          {percent_sold > 0 ? `${percent_sold}% already sold!` : "Be the first owner!"}
        </div>
      ) : null}
    </div>
  );
}