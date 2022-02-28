import React from "react";
import CustomCard from "components/UI/CustomCard/CustomCard";
import { CardBody } from "reactstrap";
import Skeleton from "react-loading-skeleton";
import styles from "./LoadingCard.module.scss";

const LoadingCard = () => {
  return (
    <div className="card-col puff-in-center dispositif">
      <CustomCard className="border-none">
        <CardBody>
          <p className={styles.text}>
            <Skeleton />
          </p>
          <Skeleton count={3} />
        </CardBody>
      </CustomCard>
    </div>
  );
};

export default LoadingCard;
