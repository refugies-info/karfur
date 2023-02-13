import React from "react";
import { GetDispositifResponse } from "api-types";

interface Props {
  contributors: GetDispositifResponse["participants"];
}

const Contributors = (props: Props) => {
  return (
    <div>
      <p className="h4">Contributeurs mobilisés ({props.contributors.length})</p>
      {props.contributors.map((user, i) => (
        <div key={i}>{user.username}</div>
      ))}
    </div>
  );
};

export default Contributors;
