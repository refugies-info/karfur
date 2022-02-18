import React, { useState, useEffect } from "react";
import _ from "lodash";
import {
  Row,
  Col,
  Card,
  CardBody,
  Carousel,
  CarouselItem,
  Badge,
} from "reactstrap";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import isInBrowser from "lib/isInBrowser";
import { colors } from "colors";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import marioProfile from "assets/mario-profile.jpg";
import styles from "./ContribCaroussel.module.scss";

interface Props {
  contributeurs: any[];
}

const ContribCarousel = (props: Props) => {
  const { t } = useTranslation();
  // Animating
  const [animating, setAnimating] = useState(false);
  const onExiting = () => setAnimating(true);
  const onExited = () => setAnimating(false);

  // Index
  const [activeIndex, setActiveIndex] = useState(0);
  const next = (maxL: number) => {
    if (animating) return;
    const nextIndex = activeIndex === maxL - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = (maxL: number) => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? maxL - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  // Contributors
  const [reducedContributors, setReduceContributors] = useState<any[]>([]);
  useEffect(() => {
    const nbCards = Math.floor(
      (((window.innerWidth - 2 * 10) * 7) / 12 - 2 * (15 + 20)) / (140 + 20)
    );

    // there may be duplicates in db in Dispositif.participants
    const deduplicatedContributors = _.uniqBy(props.contributeurs, "username");

    // reducedContributors is an array of multiple arrays containing maximum nbCards contributeurs
    const reducedContributors = (deduplicatedContributors || []).reduce(
      (acc, curr, i) => {
        if (
          i > 0 &&
          i % nbCards === 0 &&
          i !== deduplicatedContributors.length - 1
        ) {
          return {
            currGrp: [curr],
            groupedData: [...acc.groupedData, acc.currGrp],
          };
        } else if (
          i % nbCards !== 0 &&
          i === deduplicatedContributors.length - 1
        ) {
          return {
            groupedData: [...acc.groupedData, [...acc.currGrp, curr]],
            currGrp: [],
          };
        } else if (
          i % nbCards === 0 &&
          i === deduplicatedContributors.length - 1
        ) {
          return {
            groupedData: [...acc.groupedData, ...acc.currGrp, [curr]],
            currGrp: [],
          };
        }
        return {
          currGrp: [...acc.currGrp, curr],
          groupedData: acc.groupedData,
        };
      },
      { currGrp: [], groupedData: [] }
    ).groupedData;

    setReduceContributors(reducedContributors);
  }, [props.contributeurs]);

  return (
    <div className={styles.contributors}>
      <Row className={styles.header}>
        <Col lg="auto" className={styles.subheader}>
          <h5>{t("Dispositif.Contributeurs", "Contributeurs mobilisés")}</h5>
          <sup>
            <Badge color="light" className={styles.badge}>
              {reducedContributors.length}
            </Badge>
          </sup>
          <span>
            {t(
              "Dispositif.Tiennent la page",
              "Tiennent la page à jour et répondent à vos questions"
            )}
          </span>
        </Col>
        <Col lg="auto" className={styles.navigate_btn}>
          <button className="reset-btn" onClick={() => previous(reducedContributors.length)}>
            <EVAIcon
              name="arrow-ios-back-outline"
              size="large"
              fill={colors.darkColor}
            />
          </button>
          <button className="reset-btn" onClick={() => next(reducedContributors.length)}>
            <EVAIcon
              name="arrow-ios-forward-outline"
              size="large"
              fill={colors.darkColor}
            />
          </button>
        </Col>
      </Row>
      <Carousel
        activeIndex={activeIndex}
        next={() => next(reducedContributors.length)}
        previous={() => previous(reducedContributors.length)}
        className={styles.carousel}
      >
        {reducedContributors.map((item, key) => {
          if (Array.isArray(item)) {
            return (
              <CarouselItem
                onExiting={onExiting}
                onExited={onExited}
                key={key}
              >
                <div className={styles.item}>
                  {(item || []).map((contrib, subkey) => {
                    const contribImg =
                      (contrib.picture || {}).secure_url || marioProfile;
                    return (
                      <div className={styles.card_wrapper} key={subkey}>
                        <Card className={styles.card}>
                          <CardBody className={styles.card_body}>
                            <span
                              className={styles.img}
                            >
                              <Image
                                src={contribImg}
                                alt="juliette"
                                width={80}
                                height={80}
                              />
                            </span>
                            {contrib.username}
                          </CardBody>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </CarouselItem>
            );
          }
          return null;
        })}
      </Carousel>
    </div>
  );
};

export default ContribCarousel;
