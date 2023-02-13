import { GetDispositifResponse } from "api-types";
import React from "react";

interface Props {
  metadatas: GetDispositifResponse["metadatas"];
}

const Metadatas = ({ metadatas }: Props) => {
  return (
    <div>
      {metadatas.location && (
        <div>
          {metadatas.location.map((loc) => (
            <span key={loc}>{loc}</span>
          ))}
        </div>
      )}

      {metadatas.frenchLevel && (
        <div>
          {metadatas.frenchLevel.map((level) => (
            <span key={level}>{level}</span>
          ))}
        </div>
      )}

      {metadatas.important && <div>{metadatas.important}</div>}

      {/* {metadatas.age && <div>{metadatas.important}</div>} */}

      {metadatas.price && <div>{metadatas.price.value}</div>}

      {metadatas.public && <div>{metadatas.public}</div>}

      {metadatas.duration && <div>{metadatas.duration}</div>}
    </div>
  );
};

export default Metadatas;
