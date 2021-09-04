import { useSelector } from "react-redux";

import { fetchParcelMetadata } from "../data";

const useUpdateParcels = async (currentParcels, setParcels, readContracts, forceUpdate = false) => {
  const DEBUG = useSelector(state => state.debug.debug);

  var newParcels = [];
  if (currentParcels.length > 0 && !forceUpdate) return; // prevent excessive calls to IPFS
  if (readContracts) {
    const parcelIds = await readContracts.CityDaoParcel.getParcelIds();
    const parcelURIs = await readContracts.CityDaoParcel.getListedParcels();
    for (var index = 0; index < parcelIds.length; index++) {
      const parcelId = parcelIds[index];
      const ipfsHash = parcelURIs[parcelId];
      const price = await readContracts.CityDaoParcel.getPrice(parcelId);
      if (ipfsHash !== "") {
        // skip sold parcels
        try {
          const jsonManifestBuffer = await fetchParcelMetadata(ipfsHash);
          try {
            const jsonManifest = JSON.parse(jsonManifestBuffer.toString());
            newParcels.push({ id: parcelId, uri: ipfsHash, price: price, ...jsonManifest });
          } catch (e) {
            DEBUG && console.log(e);
          }
        } catch (e) {
          DEBUG && console.log(e);
        }
      }
    }
    if (newParcels.length !== currentParcels.length) {
      DEBUG && console.log("📦 Parcels:", newParcels);
      setParcels(newParcels);
    }
  }
};

export default useUpdateParcels;