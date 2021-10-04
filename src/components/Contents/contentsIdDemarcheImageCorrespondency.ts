import { ObjectId } from "../../types/interface";

export const getImageNameFromContentId = (contentId: ObjectId) => {
  if (contentId === "6051e8eebf0a6d0014ee6809") {
    return "ameli";
  }
  if (contentId === "604794f9b898f10014c9892b") {
    return "carteVitale";
  }

  if (
    [
      "60f53d7e75d5980014162589",
      "5e71fededea008004e986958",
      "6123baf66bf6bc00148a58a4",
      "60f53a5175d5980014162000",
      "5fa3f7376e3ea80047c13d49",
    ].includes(contentId)
  ) {
    return "covid";
  }

  if (
    ["5dc947cebceb3c004fc43214", "605dc3375b99ca0014a9feb2"].includes(contentId)
  ) {
    return "poleEmploi";
  }

  if (contentId === "5dc53daebceb3c004fc43060") {
    return "permisConduire";
  }

  if (contentId === "5dc2e40c2e9859001680b916") {
    return "passeport";
  }

  if (
    ["605237c2464aa50014a1fb69", "603510f966ec880014e6e86c"].includes(contentId)
  ) {
    return "ofpra";
  }

  if (
    ["5eb91481c2622f004e5fa686", "5dc2da982e9859001680b8a2"].includes(contentId)
  ) {
    return "titreSejour";
  }

  if (
    ["5fcf5a0afaef7600140a1a2d", "6092ab8e6e6476001437f0b0"].includes(contentId)
  ) {
    return "carteBancaire";
  }

  if (
    [
      "6124e425b82f500013bd9978",
      "60e4649a5f46ee00146d570f",
      "60e4649a5f46ee00146d570f",
      "5e1c8c0e0742580052a33972",
    ].includes(contentId)
  ) {
    return "caf";
  }

  if (contentId === "5e189ed30742580052a332b6") {
    return "carteIdentite";
  }
  return null;
};
