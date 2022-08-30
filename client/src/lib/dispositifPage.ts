import { DispositifContent, IDispositif, User, Theme } from "types/interface";
import API from "utils/API";
import {
  contenu,
  menu as menuDispositif,
  customConvertOption,
  infocardsDemarcheTitles,
  infocardFranceEntiere,
  ShortContent,
} from "data/dispositif";
import { convertToHTML } from "draft-convert";
import isInBrowser from "./isInBrowser";
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  ContentState,
} from "draft-js";
import h2p from "html2plaintext";
import { colors } from "colors";
import { ObjectId } from "mongodb";
import { Moment } from "moment";

let htmlToDraft: any = null;
if (isInBrowser()) {
  htmlToDraft = require("html-to-draftjs").default;
}

export const updateNbViews = (dispositif: IDispositif) => {
  if (dispositif.status === "Actif") {
    const nbVues = dispositif.nbVues ? dispositif.nbVues + 1 : 1;
    return API.updateNbVuesOrFavoritesOnContent({
      query: { id: dispositif._id, nbVues },
    });
  }
  return null;
}

export const isContentForbidden = (dispositif: IDispositif, admin: boolean, user: User | null) => {
  return dispositif.status !== "Actif" && !admin &&
    !(user?.contributions || []).includes(dispositif._id) &&
    (!dispositif.mainSponsor ||
      (dispositif.mainSponsor && !(user?.structures || []).includes(dispositif.mainSponsor._id))
    )
}

const uiElement = {
  isHover: false,
  accordion: false,
  cardDropdown: false,
  addDropdown: false,
  varianteSelected: false,
};

export const generateUiArray = (contenu: DispositifContent[], accordion: boolean) => {
  return contenu.map((x) => {
    return {
      ...uiElement,
      ...(x.children && {
        children: new Array(x.children.length).fill({
          ...uiElement,
          accordion,
        }),
      }),
    };
  })
}

// for demarche we need to be compatible with the moteur de cas.
// remove infocards not in list
// for infocard age requis, rename ageTitle in contentTitle
// if no infocard zone d'action, add one
export const generateMenu = (dispositif: IDispositif) => {
  return dispositif.typeContenu === "dispositif"
    ? dispositif.contenu
    : (dispositif.contenu || []).map((part) => {
      if (part.title !== "C'est pour qui ?") {
        return part;
      }
      const children = (part.children || [])
        .filter((child: DispositifContent) => infocardsDemarcheTitles.includes(child.title))
        .map((child) => {
          if (child.title === "Âge requis" && child.ageTitle) {
            const newFormatChild = {
              ...child,
              contentTitle: child.ageTitle,
            };
            delete newFormatChild.ageTitle;
            return newFormatChild;
          }
          return child;
        });
      if (
        children.filter((child) => child.title === "Zone d'action").length > 0
      ) {
        return {
          ...part,
          children: children,
        };
      }
      return {
        ...part,
        children: children.concat([infocardFranceEntiere]),
      };
    });
}

export const handleContentClickInComponent = (
  menu: DispositifContent[],
  disableEdit: boolean,
  key: number,
  editable: boolean,
  subkey: number | undefined = undefined
) => {
  let newMenu = [...menu];
  if (newMenu.length > key && key >= 0 && !disableEdit) {
    if (editable) {
      newMenu = newMenu.map((x) => {
        const hasNewContent = x.editable && x.editorState && x.editorState.getCurrentContent();
        // if user removed text with store empty string without html balise (so that it works with translation)
        const content =
          hasNewContent &&
            x.editorState.getCurrentContent().getPlainText() !== ""
            ? convertToHTML(customConvertOption)(
              x.editorState.getCurrentContent()
            )
            : "";
        return {
          ...x,
          editable: false,
          ...(hasNewContent && { content }),
          ...(x.children && {
            children: x.children.map((y) => {
              const hasNewContent =
                y.editable &&
                y.editorState &&
                y.editorState.getCurrentContent();
              // if user removed text with store empty string without html balise (so that it works with translation)
              const content =
                hasNewContent &&
                  y.editorState.getCurrentContent().getPlainText() !== ""
                  ? convertToHTML(customConvertOption)(
                    y.editorState.getCurrentContent()
                  )
                  : "";
              return {
                ...y,
                ...(hasNewContent && { content }),
                editable: false,
              };
            }),
          }), //draftToHtml(convertToRaw(y.editorState.getCurrentContent()))
        };
      });
    }
    let right_node = newMenu[key];
    if (subkey !== undefined && (newMenu[key]?.children || []).length > subkey) {
      right_node = (newMenu[key]?.children || [])[subkey];
    }
    right_node.editable = editable;
    if (
      editable &&
      right_node.content !== undefined &&
      right_node.content !== null
    ) {
      const contentState = ContentState.createFromBlockArray(
        htmlToDraft(right_node.isFakeContent ? "" : right_node.content)
          .contentBlocks
      );
      const rawContentState = convertToRaw(contentState) || {};
      const rawBlocks = rawContentState.blocks || [];
      const textPosition = rawBlocks.findIndex((x) =>
        (x.text || "").includes("Bon à savoir :")
      );
      const newRawBlocks = rawBlocks.filter(
        (_, i) => i < textPosition - 3 || i >= textPosition
      );
      // we have to modify inlineStyleRanges and entityRanges after removing blocks otherwise style (bold and links) are not on the right words
      const newRawContentState = {
        ...rawContentState,
        blocks: newRawBlocks.map((x) =>
          x.text.includes("Bon à savoir :")
            ? {
              ...x,
              text: x.text.replace("Bon à savoir :", ""),
              type: "header-six",
              inlineStyleRanges: x.inlineStyleRanges
                ? x.inlineStyleRanges.map((style) => {
                  return {
                    ...style,
                    offset: style.offset - 14,
                  };
                })
                : [],
              entityRanges: x.entityRanges
                ? x.entityRanges.map((style) => {
                  return {
                    ...style,
                    offset: style.offset - 14,
                  };
                })
                : [],
            }
            : x
        ),
      };
      const newContentState = convertFromRaw(newRawContentState);
      right_node.editorState = EditorState.createWithContent(newContentState);
    } else if (
      !editable &&
      right_node.editorState &&
      right_node.editorState.getCurrentContent
    ) {
      right_node.content = convertToHTML(customConvertOption)(
        right_node.editorState.getCurrentContent()
      ); //draftToHtml(convertToRaw(right_node.editorState.getCurrentContent()));
    }
    return newMenu;
  }
  return null;
};

export const getMainTheme = (dispositif: IDispositif | null): Theme => {
  const emptyImage = {
    secure_url: "",
    public_id: "",
    imgId: ""
  };
  return dispositif?.theme ?
    dispositif.theme :
    {
      _id: {} as ObjectId,
      name: {fr: ""},
      short: { fr: "" },
      colors: {
        color100: colors.gray90,
        color80: colors.gray20,
        color60: colors.gray20,
        color40: colors.gray20,
        color30: colors.gray20,
      },
      position: 0,
      icon: emptyImage,
      banner: emptyImage,
      appImage: emptyImage,
      shareImage: emptyImage,
      notificationEmoji: "",
      adminComments: ""
  };
}

export const isPinned = (dispositif: IDispositif | null, user: User | null) => {
  if (!dispositif || !user || !dispositif._id) return false;
  return (user?.cookies?.dispositifsPinned || []).some(
    (x: { _id: string }) => x._id === dispositif._id.toString()
  )
}

// SAVE DISPOSITIF
export const generateContenu = (menu: DispositifContent[]) => {
  return [...menu].map((x) => {
    const hasNewContent = x.editable && x.editorState && x.editorState.getCurrentContent();
    // if user removed text with store empty string without html balise (so that it works with translation)

    const content =
      hasNewContent &&
        x.editorState.getCurrentContent().getPlainText() !== ""
        ? convertToHTML(customConvertOption)(
          x.editorState.getCurrentContent()
        )
        : "";
    return {
      title: x.title,
      ...{ content: hasNewContent ? content : x.content },
      editable: false,
      type: x.type,
      ...(x.children && {
        children: x.children.map((y) => {
          const { editorState, ...noEditor } = y;
          const hasNewContent =
            y.editable &&
            y.editorState &&
            y.editorState.getCurrentContent();
          // if user removed text with store empty string without html balise (so that it works with translation)

          const content =
            hasNewContent &&
              y.editorState.getCurrentContent().getPlainText() !== ""
              ? convertToHTML(customConvertOption)(
                y.editorState.getCurrentContent()
              )
              : "";
          return {
            ...noEditor,
            ...(hasNewContent && { content }),
            editable: false,
            ...(y.title && { title: h2p(y.title) }),
          };
        }),
      }),
    };
  })
}

export const generateAudienceAge = (audienceAge: DispositifContent[]) => {
  const getValue = (val: number | undefined) => {
    return parseInt((val || 0).toString(), 10)
  }
  return audienceAge.length > 0
    ? audienceAge.map((x) => {
      if (x.contentTitle === "De ** à ** ans") {
        return {
          contentTitle: x.contentTitle,
          bottomValue: getValue(x.bottomValue),
          topValue: getValue(x.topValue),
        };
      }
      if (x.contentTitle === "Plus de ** ans") {
        return {
          contentTitle: x.contentTitle,
          bottomValue: getValue(x.bottomValue),
          topValue: 999,
        };
      }

      return {
        contentTitle: x.contentTitle,
        bottomValue: -1,
        topValue: getValue(x.topValue),
      };
    })
    : [{ contentTitle: "Plus de ** ans", bottomValue: -1, topValue: 999 }];
}

export const getContent = (dispositif: IDispositif | null): ShortContent => {
  if (!dispositif) return contenu
  return {
    titreInformatif: dispositif.titreInformatif,
    titreMarque: dispositif.titreMarque,
    abstract: dispositif.abstract,
    contact: dispositif.contact,
    externalLink: dispositif.externalLink,
  }
}

