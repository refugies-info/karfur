import Button from "@codegouvfr/react-dsfr/Button";
import * as AccordionRadix from "@radix-ui/react-accordion";
import { useWindowSize } from "@refugies-info/ui";
import DOMPurify from "isomorphic-dompurify";
import { useState } from "react";
import AccordionRoot from "~/components/Pages/staticPages/common/Accordion/AccordionRoot";
import Image from "~/components/UI/Image";
import { useConsent } from "~/hooks/useConsentContext";
import { cn } from "~/lib/classname";
import AutoplayVideo from "../AutoplayVideo";
import styles from "./Accordion.module.scss";

type Item = {
  title: string;
  text: string;
  image?: any;
  alt?: string;
  video?: string;
  youtube?: string;
  mediaWidth?: number;
  mediaHeight?: number;
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
  className?: string;
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
            alt={item?.alt ? item.alt : ""}
            height={item.mediaHeight}
            width={item.mediaWidth}
            className="mx-auto mt-6 h-auto max-w-full lg:mt-0"
          />
        );
      case "video":
        return (
          <AutoplayVideo
            src={item.video}
            height={item.mediaHeight || 420}
            width={item.mediaWidth}
          />
        );
      case "youtube":
        return finalityConsent?.youtube ? (
          <iframe
            width={item.mediaWidth || "560"}
            height={item.mediaHeight || "315"}
            src={item.youtube}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={cn(styles.youtube, "w-full")}
          ></iframe>
        ) : (
          <div
            className={styles.no_cookie}
            style={{ width: item.mediaWidth || 560, height: item.mediaHeight || 315 }}
          >
            Vous devez accepter les cookies pour afficher les vidéos Youtube.
          </div>
        );
    }
  };

  return (
    <div className={cn("flex gap-20", props.className)}>
      <div
        className={cn(props.withImages && "border-default-grey w-1/2 grow-1 basis-auto border-b")}
      >
        <AccordionRoot multiOpen={props.multiOpen} initOpen={props.initOpen} setOpen={setOpen}>
          {props.items.map((item, i) => {
            const isItemOpen = isOpen(i);
            return (
              <AccordionRadix.Item key={i} value={i.toString()} className={cn(item.className)}>
                <AccordionRadix.Header className="!mb-0">
                  <AccordionRadix.Trigger
                    className={cn(
                      "border-default-grey flex w-full items-center gap-4 border-t px-4 py-3",
                      isItemOpen &&
                        "bg-action-low-blue-france active:bg-action-low-blue-france-active hover:bg-action-low-blue-france-hover border-artwork-minor-blue-france",
                    )}
                  >
                    <span
                      className={cn(
                        "mb-0 grow-1 text-start text-xl font-medium",
                        isItemOpen && "text-title-blue-france",
                      )}
                    >
                      {item.title}
                    </span>
                    <i
                      className={cn(
                        "flex before:!h-4 before:!w-4",
                        isItemOpen
                          ? "fr-icon-subtract-line before:!bg-title-blue-france"
                          : "fr-icon-add-line",
                      )}
                    />
                  </AccordionRadix.Trigger>
                </AccordionRadix.Header>
                <AccordionRadix.Content className={cn(styles.content, "")}>
                  <div className="mt-4 px-4 pb-8">
                    <p
                      className={cn(styles.text, "!text-large !mb-0")}
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(item.text),
                      }}
                    ></p>

                    {isTablet && props.withImages && (
                      <>
                        {item?.image && getMedia("image", item)}
                        {item?.video && (
                          <div className="mx-auto mt-0 mb-6 max-w-[250px] !text-center">
                            {getMedia("video", item)}
                          </div>
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
                  </div>
                </AccordionRadix.Content>
              </AccordionRadix.Item>
            );
          })}
        </AccordionRoot>
      </div>
      {!isTablet && props.withImages && open.length > 0 && (
        <div
          className={cn(
            "flex w-1/2 items-center",
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
