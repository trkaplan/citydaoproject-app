import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = "pk.eyJ1IjoiZ3JlZ3JvbHdlcyIsImEiOiJja3J1cnhvbWEwMGQxMnZ0NjJ4OW80emZ6In0.XPrRJMSMXwdIC6k83O4lew";

/*
  ~ What it does? ~

  Displays map with parcel overlays for each given geojson feature.

  ~ How can I use? ~

  <ParcelMap
    parcels={parcels}
    startingCoordinates={[-106.331, 43.172]}
    startingZoom={9}
  />

  ~ Features ~

  - Provide parcels={parcels}. parcels is an array of objects with id and geojson properties.
  - Provide startingCoordinates={[latitude, longitude]} for the maps starting position.
  - Provide startingZoom={9} as the maps beginning zoom level.
*/

export default function ParcelMap({ parcels, startingCoordinates, startingZoom, buyParcel }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [activeParcel, setActiveParcel] = useState(null);

  const addParcelToMap = (geojson, parcel_id) => {
    map.current.addSource(parcel_id, {
      type: "geojson",
      data: geojson,
    });
    map.current.addLayer({
      id: parcel_id,
      source: parcel_id,
      type: "fill",
      paint: {
        "fill-color": "#eff551",
        "fill-opacity": 0.2,
        "fill-outline-color": "#eff551",
      },
    });
    // add parcel outline
    map.current.addLayer({
      id: `${parcel_id}_outline`,
      source: parcel_id,
      type: "line",
      paint: {
        "line-color": "#eff551",
        "line-width": 2,
      },
    });
  };

  const clickParcel = parcel_id => {
    setActiveParcel(parcel_id);
  };

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/gregrolwes/cksuzrjba5nsx17nkuv02r4rq",
      center: startingCoordinates,
      zoom: startingZoom,
    });
  });

  useEffect(() => {
    map.current.on("load", function () {
      parcels.forEach(parcel => {
        const parcel_name = parcel.id.toNumber().toString(); // convert big number id to string
        try {
          if (map.current.getSource(parcel_name)) return; // skip if already added
          addParcelToMap(parcel.geojson, parcel_name);
          // set click functionality
          map.current.on("click", parcel_name, function (e) {
            clickParcel(parcel.id);
          });
        } catch (e) {
          console.log(e);
        }
      });
    });
  });

  return (
    <div>
      <div style={{ display: parcels.length > 0 ? "none" : "block", margin: "20px", textAlign: "center" }}>
        Retrieving parcels...
      </div>
      <div style={{ display: parcels.length > 0 ? "block" : "none", margin: "20px", textAlign: "center" }}>
        Selected parcel: {activeParcel ? activeParcel.toNumber().toString() : null}
      </div>
      <button onClick={() => (activeParcel ? buyParcel(activeParcel) : null)}>BUY</button>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}