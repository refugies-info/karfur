import React from "react";
import { Col, Container, Row } from "reactstrap";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import styles from "./Needs.module.scss";
import { cls } from "lib/classname";

export const LoadingNeeds = () => {
  const arrayLines = new Array(12).fill("a");

  return (
    <>
      <Container fluid>
        <Row className="mt-4 mb-5">
          <Col md="auto">
            <h3 className={styles.subtitle}>Thèmes</h3>
            <div className={cls(styles.column, styles.scroll_column, styles.themes)}>
              <SkeletonTheme baseColor="#CDCDCD">
                <Skeleton height={46} count={12} className="mb-2" style={{ borderRadius: 8 }} />
              </SkeletonTheme>
            </div>
          </Col>
          <Col>
            <h3 className={styles.subtitle}>Besoins</h3>
            <div className={cls(styles.column, styles.scroll_column)}>
              <SkeletonTheme baseColor="#CDCDCD">
                <Skeleton height={46} count={4} className="mb-2" style={{ borderRadius: 8 }} />
              </SkeletonTheme>
            </div>
          </Col>
          <Col>
            <h3 className={styles.subtitle}>Fiches associées</h3>
            <div className={cls(styles.column, styles.scroll_column)}>
              <SkeletonTheme baseColor="#CDCDCD">
                <Skeleton height={70} count={7} className="mb-2" style={{ borderRadius: 8 }} />
              </SkeletonTheme>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};
