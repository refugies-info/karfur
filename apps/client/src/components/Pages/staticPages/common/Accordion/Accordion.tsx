import Button from "@codegouvfr/react-dsfr/Button";
import * as AccordionRadix from "@radix-ui/react-accordion";
import { sanitize } from "isomorphic-dompurify";
import { useState } from "react";
import AccordionRoot from "~/components/Pages/staticPages/common/Accordion/AccordionRoot";
import Image from "~/components/UI/Image";
import { useConsent } from "~/hooks/useConsentContext";
import useWindowSize from "~/hooks/useWindowSize";
import { cls } from "~/lib/classname";
import AutoplayVideo from "../AutoplayVideo";
import styles from "./Accordion.module.scss";

type Item = {
  title: string;
  text: string;
  image?: any;
  video?: string;
  youtube?: string;
  mediaWidth?: number;
  mediaHeight?: number;
  noShadow?: boolean;
  cta?: {
    text: string;
    link: string;
  };
  className?: string;
};

interface Props {
  items: Item[];
  withImages?: boolean; // not compatible with multi open
  multiOpen?: boolean;
  initOpen?: boolean;
  mediaAlign?: "right" | "center";
}

const Accordion = (props: Props) => {
  const { finalityConsent } = useConsent();
  const [open, setOpen] = useState<number[]>(props.initOpen ? [0] : []);
  const { isTablet } = useWindowSize();

  const isOpen = (index: number) => {
    return open.includes(index);
  };

  const getMedia = (type: "image" | "video" | "youtube", item: Item) => {
    switch (type) {
      case "image":
        return (
          <Image
            src={item?.image}
            alt=""
            height={item.mediaHeight}
            width={item.mediaWidth}
            className="max-w-full h-auto mx-auto mt-6 lg:mt-0"
          />
        );
      case "video":
        return (
          <AutoplayVideo
            src={item.video}
            height={item.mediaHeight || 420}
            width={item.mediaWidth}
            noShadow={item.noShadow}
          />
        );
      case "youtube":
        return !!finalityConsent?.youtube ? (
          <iframe
            width={item.mediaWidth || "560"}
            height={item.mediaHeight || "315"}
            src={item.youtube}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={styles.youtube}
          ></iframe>
        ) : (
          <div className={styles.no_cookie} style={{ width: item.mediaWidth || 560, height: item.mediaHeight || 315 }}>
            Vous devez accepter les cookies pour afficher les vidéos Youtube.
          </div>
        );
    }
  };

  return (
    <div className="flex gap-20">
      <div className={cls(props.withImages && "w-1/2 grow-1 basis-auto")}>
        <AccordionRoot multiOpen={props.multiOpen} initOpen={props.initOpen} setOpen={setOpen}>
          {props.items.map((item, i) => {
            const isItemOpen = isOpen(i);
            return (
              <AccordionRadix.Item key={i} value={i.toString()} className={cls(item.className)}>
                <AccordionRadix.Header className="!mb-0">
                  <AccordionRadix.Trigger
                    className={cls(
                      "py-3 px-4 w-full !border-t !border-border flex items-center gap-4 hover:!bg-light-alt-blue",
                      isItemOpen && "!bg-light-low-blue-france hover:!bg-light-alt-blue !border-purple-france",
                    )}
                  >
                    <span
                      className={cls(
                        "!text-chapo !text-left !font-medium !mb-0 grow-1",
                        isItemOpen && "!text-blue-france",
                      )}
                    >
                      {item.title}
                    </span>
                    <i
                      className={cls(
                        isItemOpen ? "fr-icon-subtract-line" : "fr-icon-add-line",
                        "before:!w-4 before:!h-4 flex",
                        isItemOpen && "before:!bg-blue-france",
                      )}
                    />
                  </AccordionRadix.Trigger>
                </AccordionRadix.Header>
                <AccordionRadix.Content className={cls(styles.content, "mt-4 px-4 pb-8")}>
                  <p
                    className={cls(styles.text, "!text-large !mb-0")}
                    dangerouslySetInnerHTML={{
                      __html: sanitize(item.text),
                    }}
                  ></p>

                  {isTablet && props.withImages && (
                    <>
                      {item?.image && getMedia("image", item)}
                      {item?.video && (
                        <div className="max-w-[250px] mx-auto mt-0 mb-6 !text-center">{getMedia("video", item)}</div>
                      )}
                      {item?.youtube && getMedia("youtube", item)}
                    </>
                  )}
                  {item.cta && (
                    <Button
                      priority="tertiary"
                      iconId="fr-icon-arrow-right-line"
                      iconPosition="right"
                      linkProps={{
                        href: item.cta.link,
                      }}
                      className="mt-4"
                    >
                      {item.cta.text}
                    </Button>
                  )}
                </AccordionRadix.Content>
              </AccordionRadix.Item>
            );
          })}
        </AccordionRoot>
      </div>
      {!isTablet && props.withImages && open.length > 0 && (
        <div
          className={cls(
            "w-1/2 flex items-center",
            props.mediaAlign === "center" ? "justify-center" : "justify-end",
            props.items[open[0]]?.className,
          )}
        >
          {props.items[open[0]]?.image && getMedia("image", props.items[open[0]])}
          {props.items[open[0]]?.video && getMedia("video", props.items[open[0]])}
          {props.items[open[0]]?.youtube && getMedia("youtube", props.items[open[0]])}
        </div>
      )}
    </div>
  );
};

export default Accordion;
