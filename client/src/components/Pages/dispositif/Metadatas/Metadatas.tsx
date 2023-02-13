import { GetDispositifResponse } from "api-types";
import React from "react";
import Card from "./Card";
import { getAge, getMetadataTitle, getPrice, getPublic } from "./functions";

interface Props {
  metadatas: GetDispositifResponse["metadatas"];
}

const Metadatas = ({ metadatas }: Props) => {
  return (
    <div>
      <p className="h2">C'est pour qui ?</p>
      {metadatas.location && <Card title={getMetadataTitle("location")} text={metadatas.location.join(", ")} />}

      {metadatas.frenchLevel && metadatas.frenchLevel.length > 0 && (
        <Card title={getMetadataTitle("frenchLevel")} text={metadatas.frenchLevel.join(", ")} />
      )}

      {metadatas.important && <Card title={getMetadataTitle("important")} text={metadatas.important} />}

      {metadatas.age && <Card title={getMetadataTitle("age")} text={getAge(metadatas.age)} />}

      {metadatas.price && <Card title={getMetadataTitle("price")} text={getPrice(metadatas.price)} />}

      {metadatas.public && <Card title={getMetadataTitle("public")} text={getPublic(metadatas.public)} />}

      {metadatas.duration && <Card title={getMetadataTitle("duration")} text={metadatas.duration} />}
    </div>
  );
};

export default Metadatas;
