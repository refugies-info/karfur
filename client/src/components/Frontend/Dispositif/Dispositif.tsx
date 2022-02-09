import React, { useEffect, useState, useRef, createRef } from "react";
import { useTranslation } from "next-i18next";
import { Col, Row, Spinner } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import ContentEditable from "react-contenteditable";
import dynamic from "next/dynamic";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  ContentState,
} from "draft-js";
import moment from "moment/min/moment-with-locales";
import Swal from "sweetalert2";
import h2p from "html2plaintext";
import _ from "lodash";
import { convertToHTML } from "draft-convert";
import API from "utils/API";
import Sponsors from "components/Frontend/Dispositif/Sponsors/Sponsors";
import { ContenuDispositif } from "components/Frontend/Dispositif/ContenuDispositif";
import {
  BookmarkedModal,
  DispositifCreateModal,
  DispositifValidateModal,
  ReactionModal,
  ResponsableModal,
  RejectionModal,
  TagsModal,
  FrameModal,
  DraftModal,
  ShareContentOnMobileModal,
} from "components/Modals/index";
import FButton from "components/FigmaUI/FButton/FButton";
import { Tags } from "components/Pages/dispositif/Tags";
import { LanguageToReadModal } from "components/Pages/dispositif/LanguageToReadModal/LanguagetoReadModal";
import { LeftSideDispositif } from "components/Frontend/Dispositif/LeftSideDispositif";
import { BandeauEdition } from "components/Frontend/Dispositif/BandeauEdition";
import { TopRightHeader } from "components/Frontend/Dispositif/TopRightHeader";
import { fetchUserActionCreator } from "services/User/user.actions";
import { fetchActiveDispositifsActionsCreator } from "services/ActiveDispositifs/activeDispositifs.actions";
import ContribCaroussel from "components/Pages/dispositif/ContribCaroussel/ContribCaroussel";
import SideTrad from "components/Pages/dispositif/SideTrad/SideTrad";
import ExpertSideTrad from "components/Pages/dispositif/SideTrad/ExpertSideTrad";
import DemarcheCreateModal from "components/Modals/DemarcheCreateModal/DemarcheCreateModal";
import { initializeTimer } from "containers/Translation/functions";
import {
  contenu,
  menu as menuDispositif,
  filtres,
  importantCard,
  showModals,
  menuDemarche,
  customConvertOption,
  infocardsDemarcheTitles,
  infocardFranceEntiere,
  ShortContent,
} from "data/dispositif";
import { BackButton } from "components/Frontend/Dispositif/BackButton";
import { colors } from "colors";
import {
  fetchSelectedDispositifActionCreator,
  updateUiArrayActionCreator,
  updateSelectedDispositifActionCreator,
  setUiArrayActionCreator,
  setSelectedDispositifActionCreator,
} from "services/SelectedDispositif/selectedDispositif.actions";
import {
  updateNbViews,
  generateUiArray,
  generateMenu,
  handleContentClickInComponent,
  getMainTag,
  isPinned,
  generateContenu,
  generateAudienceAge,
  getContent,
  isContentForbidden,
} from "lib/dispositifPage";
import { EnBrefBanner } from "components/Frontend/Dispositif/EnBrefBanner";
import { FeedbackFooter } from "components/Frontend/Dispositif/FeedbackFooter";
import { initGA, Event } from "lib/tracking";
import { logger } from "logger";
import { isMobile } from "react-device-detect";
import { PdfCreateModal } from "components/Modals/PdfCreateModal/PdfCreateModal";
import styled from "styled-components";
import isInBrowser from "lib/isInBrowser";
import styles from "scss/pages/dispositif.module.scss";
import SEO from "components/Seo";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import { userDetailsSelector } from "services/User/user.selectors";
import { userSelector } from "services/User/user.selectors";
import { DispositifContent, IDispositif, Language, Structure, Tag } from "types/interface";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import { toggleLangueActionCreator } from "services/Langue/langue.actions";
import useRTL from "hooks/useRTL";
import { tags } from "data/tags";

moment.locale("fr");

let htmlToDraft: any = null;
if (isInBrowser()) {
  htmlToDraft = require("html-to-draftjs").default;
}
const NotificationContainer = dynamic(
  () => import("react-notifications").then((mod) => mod.NotificationContainer),
  { ssr: false }
);
const NotificationManager = dynamic(
  () => import("react-notifications").then((mod) => mod.NotificationManager),
  { ssr: false }
);

const InfoBoxLanguageContainer = styled.div`
  display: flex;
  max-width: 1002px;
  color: ${colors.blanc};
  background-color: ${colors.focus};
  border-radius: 12px;
  padding: 16px;
  justify-content: space-between;
  align-items: flex-start;
  margin: ${isMobile ? "16px" : "0px 20px 20px 40px"};
`;

const TextOtherLanguageContainer = styled.p`
  display: flex;
  color: ${colors.grisFonce};
  font-size: 18px;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: center;
  margin: ${isMobile ? "auto" : "auto 40px"};
  padding: ${isMobile ? "16px" : 0};
`;

const uiElement = {
  isHover: false,
  accordion: false,
  cardDropdown: false,
  addDropdown: false,
  varianteSelected: false,
};
const initialShowModals = showModals;
const MAX_NUMBER_CHARACTERS_INFOCARD = 40;

interface Props {
  translating?: boolean;
  type: "detail" | "create" | "translation";
}

const Dispositif = (props: Props) => {
  const newRef = createRef<HTMLDivElement>();
  const sponsorsRef = createRef<HTMLDivElement>();

  const [accordion, setAccordion] = useState(new Array(1).fill(false));
  const [disableEdit, setDisableEdit] = useState(true);
  const [isModified, setIsModified] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [showSpinnerPrint, setShowSpinnerPrint] = useState(false);
  const [showSpinnerBookmark, setShowSpinnerBookmark] = useState(false);
  const [showAlertBoxLanguage, setShowAlertBoxLanguage] = useState(true);
  const [suggestion, setSuggestion] = useState("");
  const [tKeyValue, setTKeyValue] = useState(-1);
  const [tSubkey, setTSubkey] = useState<number|null>(-1);
  const [isDispositifLoading, setIsDispositifLoading] = useState(false);
  const [withHelp, setWithHelp] = useState(process.env.NODE_ENV !== "development");
  const [inputBtnClicked, setInputBtnClicked] = useState(false);
  const [time, setTime] = useState(0);
  const [printing, setPrinting] = useState(false);
  const [didThank, setDidThank] = useState(false);
  const [finalValidation, setFinalValidation] = useState(false);
  const [tutorielSection, setTutorielSection] = useState("");
  const [displayTuto, setDisplayTuto] = useState(true);
  const [addMapBtn, setAddMapBtn] = useState(true);

  // Modals
  const [showModals, setShowModals] = useState(initialShowModals);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [showDispositifCreateModal, setShowDispositifCreateModal] = useState(false);
  const [showDispositifValidateModal, setShowDispositifValidateModal] = useState(false);
  const [showGeolocModal, setShowGeolocModal] = useState(false);
  const [showLanguageToReadModal, setShowLanguageToReadModal] = useState(false);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showTutorielModal, setShowTutorielModal] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [showShareContentOnMobileModal, setShowShareContentOnMobileModal] = useState(false);

  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const dispositif = useSelector(selectedDispositifSelector); // loaded by serverSideProps
  const user = useSelector(userDetailsSelector);
  const admin = useSelector(userSelector)?.admin;
  const langues = useSelector(allLanguesSelector);

  // Initial data
  const [menu, setMenu] = useState<DispositifContent[]>(dispositif ? generateMenu(dispositif) : []);
  const timer = useRef<number|undefined>();

  useEffect(() => {
    if (!user) dispatch(fetchUserActionCreator());

    if (props.type === "detail") { // DETAIL
      if (dispositif) {
        updateNbViews(dispositif, !!props.translating);

        // case dispositif not active and user neither admin nor contributor nor in structure
        if (isContentForbidden(dispositif, admin, user)) { // TODO: not secure
          router.push(user ? "/" : "/login");
          return;
        }
        /* WHY THIS?
        const secondarySponsor = dispositif.sponsors.filter((sponsor) => !sponsor._id && sponsor.nom);
        const sponsors = secondarySponsor || []; */

        //document.title = this.state.content.titreMarque || this.state.content.titreInformatif;
      }
    }

    if (props.type === "create") { // CREATE
      const isAuth = API.isAuth();
      if (isAuth) {
        // TODO : init empty dispositif
        // initialize the creation of a new dispositif if user is logged in
        const menuContenu = dispositif?.typeContenu === "demarche" ? menuDemarche : menuDispositif;
        setDisableEdit(false);
        // setUiArray(generateUiArray(menuContenu, true));
        setShowDispositifCreateModal(true); //A modifier avant la mise en prod
        setMenu(
          menuContenu.map((x) => {
            return {
              ...x,
              type: x.type || "paragraphe",
              isFakeContent: true,
              content: x.type ? "" : (x.content || ""),
              editorState: EditorState.createWithContent(
                ContentState.createFromBlockArray(htmlToDraft("").contentBlocks)
              ),
            };
          })
        );
      } else {
        router.push({ pathname: "/login" });
        // state: { redirectTo: "/dispositif" }, // TODO : location.state
      }
    }
  }, []);

  // Auto-save
  useEffect(() => {
    if (!disableEdit) {
      if (timer.current) clearInterval(timer.current);
      timer.current = initializeTimer(3 * 60 * 1000, () => {
        // eslint-disable-next-line no-use-before-define
        valider_dispositif("Brouillon", true);
      });
    }
    return () => { if (timer.current) clearInterval(timer.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disableEdit]);

  const onInputClicked = (ev: any) => {
    // when clicking on titreInformatif or titreMarque (name of asso)
    // if titre informatif is 'Titre informatif' we store "" instead of titre informatif
    // same for titre marque

    const id = ev.currentTarget.id;
    if (
      !disableEdit &&
      ((id === "titreInformatif" &&
        dispositif?.titreInformatif === contenu.titreInformatif) ||
        (id === "titreMarque" &&
          dispositif?.titreMarque === contenu.titreMarque))
    ) {
      dispatch(updateSelectedDispositifActionCreator({ [id]: "" }));
    }
  };

  const handleChange = (ev: any) => {
    const value = ev.target.value;
    dispatch(
      updateSelectedDispositifActionCreator({ [ev.currentTarget.id]: value })
    );
    setIsModified(true);
  };

  const handleKeyPress = (ev: any, index: number) => {
    if (ev.key === "Enter") {
      ev.preventDefault();
      if (index === 0 && dispositif?.titreMarque === contenu.titreMarque) {
        dispatch(updateSelectedDispositifActionCreator({ titreMarque: "" }));
        document?.getElementById("titreMarque")?.focus();
      }
    }
  };

  // const fwdSetState = (fn, cb) => this.setState(fn, cb); // TODO : handle in SideTrad

  const handleMenuChange = (ev: any, value: any = null) => {
    const node = ev.currentTarget;
    let newMenu = [...menu];
    newMenu[node.id] = {
      ...newMenu[node.id],
      ...(!node.dataset.subkey && {
        [(node.dataset || {}).target || "content"]:
          value || (value === null && ev.target.value),
        isFakeContent: false,
      }),
      ...(node.dataset.subkey &&
        (newMenu[node.id].children || []).length > node.dataset.subkey && {
          children: (newMenu[node.id]?.children || []).map((y, subidx) => {
            return {
              ...y,
              ...(subidx === parseInt(node.dataset.subkey) && {
                [node.dataset.target || "content"]:
                  value ||
                  // in infocards we want to limit the number of caracters
                  (value === null && y.type === "card"
                    ? ev.target.value.substring(
                        0,
                        MAX_NUMBER_CHARACTERS_INFOCARD
                      )
                    : ev.target.value),
                isFakeContent: false,
              }),
            };
          }),
        }),
    };

    setMenu(newMenu);
    setIsModified(true);
  };

  const updateUI = (
    key: number,
    subkey: number | undefined,
    editable: boolean
  ) => {
    if (
      editable &&
      (subkey === undefined || (subkey === 0 && key > 1)) &&
      withHelp
    ) {
      try {
        //On place le curseur à l'intérieur du wysiwyg et on ajuste la hauteur
        const target =
          key === 0 || subkey !== undefined
            ? "editeur-" + key + "-" + subkey
            : key === 1
            ? "card-col col-lg-4"
            : undefined;
        if (!target) return;
        let parentNode: HTMLInputElement = document?.getElementsByClassName(
          target
        )[0] as HTMLInputElement;
        if (subkey && parentNode) {
          (parentNode
            ?.getElementsByClassName("public-DraftEditor-content")[0] as HTMLInputElement)
            ?.focus();
          if (isInBrowser()) window?.getSelection()?.addRange(document?.createRange());
          const height = (parentNode.getElementsByClassName("public-DraftEditorPlaceholder-inner")?.[0] as HTMLElement)?.offsetHeight + "px";
          (parentNode.getElementsByClassName("DraftEditor-root")[0] as HTMLElement).style.height = height;
        }
      } catch (e: any) {
        logger.error("error", { error: e.message });
      }
      setInputBtnClicked(false);
    }
  };

  const updateUIArray = (
    key: number,
    subkey: number | null = null,
    node = "isHover",
    value = true
  ) => {
    if (!dispositif) return;
    let newUiArray = [...dispositif.uiArray];
    const updateOthers =
      node !== "varianteSelected" && (disableEdit || node !== "accordion");
    newUiArray = newUiArray.map((x, idx) => {
      return {
        ...x,
        ...((subkey === null && idx === key && { [node]: value }) ||
          (updateOthers && { [node]: false })),
        ...(x.children && {
          children: x.children.map((y: any, subidx: number) => {
            return {
              ...y,
              ...((subidx === subkey && idx === key && { [node]: value }) ||
                (updateOthers && { [node]: false })),
            };
          }),
        }),
      };
    });

    dispatch(
      updateUiArrayActionCreator({ subkey, key, node, value, updateOthers })
    );
    setTKeyValue(key);
    setTSubkey(subkey);
  };

  const handleContentClick = (
    key: number,
    editable: boolean,
    subkey: number | undefined = undefined
  ) => {
    const newMenu = handleContentClickInComponent(
      menu,
      disableEdit,
      key,
      editable,
      subkey
    );
    if (newMenu) {
      let right_node = newMenu[key];
      if (
        subkey !== undefined &&
        (newMenu[key]?.children || []).length > subkey
      ) {
        right_node = (newMenu[key]?.children || [])[subkey];
      }
      if (right_node.type === "accordion") {
        updateUIArray(key, subkey, "accordion", true);
      }

      setMenu(newMenu);
      updateUI(key, subkey, editable);
    }
  };

  const onEditorStateChange = (
    editorState: EditorState,
    key: number,
    subkey: number | null = null
  ) => {
    let newMenu = [...menu];

    if (newMenu.length > key) {
      const content =
        editorState.getCurrentContent().getPlainText() !== ""
          ? convertToHTML(customConvertOption)(editorState.getCurrentContent())
          : "";
      if (subkey !== null && (newMenu[key].children || []).length > subkey) {
        const newChildrenMenu = newMenu[key]?.children?.[subkey];
        if (newChildrenMenu) {
          //@ts-ignore
          newMenu[key].children[subkey] = {
            ...newChildrenMenu,
            editorState: editorState,
            isFakeContent: false,
            content: content,
          }
        }
      } else {
        newMenu[key].editorState = editorState;
        newMenu[key].isFakeContent = false;
        newMenu[key].content = content;
      }
      setMenu(newMenu);
      setIsModified(true);
    }
  };

  const addItem = (
    key: number,
    type = "paragraphe",
    subkey: string | null = null
  ) => {
    if (!dispositif) return;
    let prevState = [...menu];
    let newUiArray = [...dispositif.uiArray];
    const importantCard = {
      type: "card",
      isFakeContent: true,
      title: "Important !",
      titleIcon: "warning",
      contentTitle: "Compte bancaire",
      contentBody: "nécessaire pour recevoir l’indemnité",
      footer: "Pourquoi ?",
      footerIcon: "question-mark-circle-outline",
      content: "",
    };
    const children = prevState[key]?.children || [];
    if (children.length > 0) {
      let newChild = { ...children[children.length - 1] };
      if (type === "card" && newChild.type !== "card") {
        prevState[key].type = "cards";
        newChild = importantCard;
      } else if (type === "card") {
        const menuFiche =
          dispositif.typeContenu === "dispositif"
            ? menuDispositif
            : menuDemarche;
        // the new child is an infocard which title is subkey (a title that is not already displayed)
        newChild =
          (menuFiche[1]?.children || []).filter(
            (x) => x.title === subkey
          )?.[0] || importantCard;

        // very strange behaviour, when adding IC geoloc menu contains actual state and not data so overide newChild with correct value
        if (subkey === "Zone d'action") {
          newChild = {
            type: "card",
            isFakeContent: true,
            title: "Zone d'action",
            titleIcon: "pin-outline",
            typeIcon: "eva",
            departments: [],
            free: true,
            contentTitle: "Sélectionner",
            content: "",
          };
        }
      } else if (type === "accordion") {
        newChild = {
          type: "accordion",
          isFakeContent: true,
          content: "",
          title: "",
        };
      } else if (type === "map") {
        newChild = {
          type: "map",
          isFakeContent: true,
          isMapLoaded: false,
          markers: [],
          title: "",
          content: "",
        };
        setAddMapBtn(false);
      } else if (type === "paragraph" && !newChild.content) {
        newChild = {
          title: "Un exemple de paragraphe",
          isFakeContent: true,
          content: "",
          type: type,
        };
      } else if (type === "etape") {
        newChild = {
          type: "etape",
          title: "",
          papiers: [],
          duree: "00",
          timeStepDuree: "minutes",
          delai: "00",
          timeStepDelai: "minutes",
          option: {},
          isFakeContent: false,
          content: "",
        };
      }
      newChild.type = type;
      if (
        subkey === null ||
        subkey === undefined ||
        subkey === "Zone d'action"
      ) {
        children.push(newChild);
      } else {
        //@ts-ignore
        children.splice(subkey + 1, 0, newChild);
      }
    } else {
      if (type === "card") {
        prevState[key].type = "cards";
        prevState[key].children = [
          {
            type: "card",
            isFakeContent: true,
            title: "Important !",
            titleIcon: "warning",
            contentTitle: "Compte bancaire",
            contentBody: "nécessaire pour recevoir l’indemnité",
            footer: "Pourquoi ?",
            footerIcon: "question-mark-circle-outline",
            editable: false,
            content: "",
          },
        ];
      } else if (type === "map") {
        prevState[key].children = [
          {
            type: "map",
            isFakeContent: true,
            isMapLoaded: false,
            markers: [],
            content: "",
            title: "",
          },
        ];
      } else {
        prevState[key].children = [
          {
            title: "Nouveau sous-paragraphe",
            type: type,
            editable: false,
            content: "",
          },
        ];
      }
    }
    newUiArray[key].children = [
      ...(newUiArray[key].children || []),
      { ...uiElement, accordion: true, varianteSelected: true },
    ];
    setMenu(prevState);
    dispatch(setUiArrayActionCreator(newUiArray));
  };

  const removeItem = (key: number, subkey: number|null = null) => {
    if (!dispositif) return;
    let prevState = [...menu];
    let newUiArray = [...dispositif.uiArray];
    const children = prevState[key].children;
    if (
      children &&
      children.length > 0 &&
      (children.length > 1 || prevState[key].content)
    ) {
      if (subkey === null || subkey === undefined) {
        (prevState[key].children || []).pop();
        (newUiArray[key].children || []).pop();
      } else if ((prevState[key].children || []).length > subkey) {
        (prevState[key].children || []).splice(subkey, 1);
        (newUiArray[key].children || []).splice(subkey, 1);
      }
    }
    setMenu(prevState);
  };

  const deleteCard = (key: number, subkey: number, type: string) => {
    if (type === "map") {
      setAddMapBtn(true);
      setIsModified(true);
    }
    const prevState = [...menu];
    prevState[key].children = (prevState[key].children || []).filter(
      (_, i) => i !== subkey
    );
    setMenu(prevState);
    setIsModified(true);
  };

  const toggleNiveau = (selectedLevels: any, key: number, subkey: number) => {
    setMenu(
      [...menu].map((x, i) =>
        i === key
          ? {
              ...x,
              children: (x.children || []).map((y, ix) =>
                ix === subkey ? { ...y, niveaux: selectedLevels } : y
              ),
            }
          : x
      )
    );
  };
  const toggleFree = (key: number, subkey: number) => {
    setMenu(
      [...menu].map((x, i) =>
        i === key
          ? {
              ...x,
              children: (x.children || []).map((y, ix) =>
                ix === subkey
                  ? { ...y, free: !y.free, isFakeContent: false }
                  : y
              ),
            }
          : x
      )
    );
    setIsModified(true);
  };
  const changeDepartements = (
    departments: any,
    key: number,
    subkey: number
  ) => {
    setMenu(
      [...menu].map((x, i) =>
        i === key
          ? {
              ...x,
              children: (x.children || []).map((y, ix) =>
                ix === subkey
                  ? { ...y, departments: departments, isFakeContent: false }
                  : y
              ),
            }
          : x
      )
    );
    setIsModified(true);
  };
  const changePrice = (e: any, key: number, subkey: number) => {
    setMenu(
      [...menu].map((x, i) =>
        i === key
          ? {
              ...x,
              children: (x.children || []).map((y, ix) =>
                ix === subkey
                  ? { ...y, price: e.target.value, isFakeContent: false }
                  : y
              ),
            }
          : x
      )
    );
    setIsModified(true);
  };
  const changeAge = (e: any, key: number, subkey: number, isBottom = true) => {
    setMenu(
      [...menu].map((x, i) =>
        i === key
          ? {
              ...x,
              children: (x.children || []).map((y, ix) =>
                ix === subkey
                  ? {
                      ...y,
                      [isBottom ? "bottomValue" : "topValue"]: (
                        e.target.value || ""
                      ).replace(/\D/g, ""),
                      isFakeContent: false,
                    }
                  : y
              ),
            }
          : x
      )
    );
    setIsModified(true);
  };
  const setMarkers = (markers: any, key: number, subkey: number) => {
    setMenu(
      [...menu].map((x, i) =>
        i === key
          ? {
              ...x,
              children: (x.children || []).map((y, ix) =>
                ix === subkey ? { ...y, markers, isFakeContent: false } : y
              ),
            }
          : x
      )
    );
  };

  const bookmarkDispositif = () => {
    if (!dispositif) return;
    setShowSpinnerBookmark(true);
    if (API.isAuth() && user) {
      const newUser = { ...user };
      const pinned = isPinned(dispositif, user);
      if (pinned) {
        newUser.cookies.dispositifsPinned = (
          user?.cookies?.dispositifsPinned || []
        ).filter((x: any) => x._id !== dispositif._id);
      } else {
        newUser.cookies.dispositifsPinned = [
          ...(user?.cookies?.dispositifsPinned || []),
          { _id: dispositif._id, datePin: new Date() },
        ];
      }

      API.set_user_info(newUser).then(() => {
        dispatch(fetchUserActionCreator);
        setShowSpinnerBookmark(false);
        setShowBookmarkModal(!pinned);
        setIsAuth(true);
      });
    } else {
      setShowSpinnerBookmark(false);
      setShowBookmarkModal(true);
      setIsAuth(false);
    }
  };
  const changeCardTitle = (
    key: number,
    subkey: number,
    node: string,
    value: string
  ) => {
    const prevState = [...menu];
    if (node === "title") {
      const newContent = (menuDispositif[1].children || [])
      .concat(importantCard)
      .find((x: any) => x.title === value);
      if (newContent && prevState[key].children) {
        //@ts-ignore
        prevState[key].children[subkey] = newContent;
      }
    } else {
      //@ts-ignore
      prevState[key].children[subkey][node] = value;
    }
    setMenu(prevState);
    setIsModified(true);
  };

  // TAGS
  const changeTag = (key: number, value: Tag) => {
    if (!dispositif) return;
    const newTags = dispositif.tags.map((x, i) => (i === key ? value : x));
    dispatch(updateSelectedDispositifActionCreator({ tags: newTags }));
  };
  const addTag = (tags: Tag[]) => {
    dispatch(updateSelectedDispositifActionCreator({ tags: tags }));
  };
  const validateTags = (tags: Tag[]) => {
    dispatch(updateSelectedDispositifActionCreator({ tags: tags }));
  };
  const deleteTag = (idx: number) => {
    if (!dispositif) return;
    dispatch(
      updateSelectedDispositifActionCreator({
        tags: [...dispositif.tags].filter((_, i) => i !== idx),
      })
    );
  };

  // SPONSORS
  const addSponsor = (sponsor: Structure) => {
    const newSponsors = [...(dispositif?.sponsors || []), sponsor];
    dispatch(updateSelectedDispositifActionCreator({ sponsors: newSponsors }))
  };
  const editSponsor = (key: number, sponsor: Structure) => {
    const newItems = [...(dispositif?.sponsors || [])];
    newItems[key] = sponsor;
    dispatch(updateSelectedDispositifActionCreator({ sponsors: newItems }))
  };
  const deleteSponsor = (key: number) => {
    if (!dispositif) return;
    const status = dispositif.status;
    if ((status === "Accepté structure" ||
        status === "Actif" ||
        status === "En attente admin") &&
      !admin
    ) {
      Swal.fire({
        title: "Oh non!",
        text: "Vous ne pouvez plus supprimer de structures partenaires",
        type: "error",
        timer: 1500,
      });
      return;
    }
    dispatch(updateSelectedDispositifActionCreator({
      sponsors: (dispositif.sponsors || []).filter((_, i) => i !== key)
    }))
  };
  const deleteMainSponsor = () => {
    if (!dispositif) return;
    const status = dispositif.status;
    if ((status === "Accepté structure" ||
        status === "Actif" ||
        status === "En attente admin") &&
      !admin
    ) {
      Swal.fire({
        title: "Oh non!",
        text: "Vous ne pouvez plus supprimer de structures partenaires",
        type: "error",
        timer: 1500,
      });
      return;
    }
    dispatch(updateSelectedDispositifActionCreator({ mainSponsor: undefined }));
  };

  // MODALS
  const toggleModal = (show: boolean, name: string) => {
    if (name === "merci" && showModals.merci) {
      Swal.fire({
        title: "Yay...",
        text: "Votre suggestion a bien été enregistrée, merci",
        type: "success",
        timer: 1500,
      });
    }
    setShowModals((prevState) => ({ ...prevState, [name]: show }));
    setSuggestion("");
  };
  const toggleTutorielModal = (section: string) => {
    setShowTutorielModal(!showTutorielModal);
    setTutorielSection(section);
  };
  const toggleDispositifValidateModal = () => {
    setShowDispositifValidateModal(!showDispositifValidateModal);
    setFinalValidation(false);
  };
  const toggleDispositifValidateModalFinal = () => {
    setShowDispositifValidateModal(!showDispositifValidateModal);
    setFinalValidation(false);
  };

  const goBack = () => {
    /* if (
      this.props.location.state &&
      this.props.location.state.previousRoute &&
      this.props.location.state.previousRoute === "advanced-search"
    ) {
      this.props.history.go(-1);
    } else { */ //TODO : location.state
    router.push({ pathname: "/advanced-search" });
    // }
  };

  const closePdf = () => {
    setShowSpinnerPrint(false);
    setPrinting(false);
  };

  const createPdf = () => {
    if (!dispositif) return;
    initGA();
    Event("EXPORT_PDF", router.locale || "fr", "label");
    let newUiArray = [...dispositif.uiArray];
    newUiArray = newUiArray.map((x) => ({
      ...x,
      accordion: true,
      ...(x.children && {
        children: x.children.map((y) => {
          return { ...y, accordion: true };
        }),
      }),
    }));
    dispatch(setUiArrayActionCreator(newUiArray));
    setShowSpinnerPrint(true);
    setPrinting(true);
  };

  const printPdf = () => {
    if (isInBrowser()) window.print();
  };

  const editDispositif = (_ = null, disableEdit = false) => {
    /* this.props.history.push({
      state: {
        editable: true,
      },
    }); */ // TODO : location.state
    if (!dispositif) return;
    setDisableEdit(disableEdit);
    const newUiArray = [...menu].map((x, i) => ({
      ...uiElement,
      ...(dispositif.uiArray.length > i && {
        varianteSelected: dispositif.uiArray[i].varianteSelected,
      }),
      ...(x.children && {
        children: x.children.map((_, j) => ({
          ...uiElement,
          ...(dispositif.uiArray.length > i &&
            dispositif.uiArray[i] &&
            dispositif.uiArray[i].children &&
            (dispositif.uiArray[i].children || []).length > j && {
              varianteSelected:
                dispositif.uiArray[i]?.children?.[j]?.varianteSelected,
            }),
          accordion: !disableEdit,
        })),
      }),
    }));
    dispatch(setUiArrayActionCreator(newUiArray));
  };

  // save reaction and display modal of success
  const pushReaction = (modalName = null, fieldName: string) => {
    // for a "Merci" modalName is null and fieldName is merci
    if (modalName) {
      toggleModal(false, modalName);
    }
    const newDispositif = {
      dispositifId: dispositif?._id,
      keyValue: tKeyValue,
      subkey: tSubkey,
      fieldName: fieldName,
      type: "add",
      ...(suggestion && { suggestion: h2p(suggestion) }),
    };

    API.updateDispositifReactions(newDispositif).then(() => {
      Swal.fire({
        title: "Yay...",
        text: "Votre réaction a bien été enregistrée, merci",
        type: "success",
        timer: 1500,
      });
      if (fieldName === "merci") {
        setDidThank(true);
      }
    });
  };

  const update_status = (status: string) => {
    if (!dispositif) return;
    let newDispositif = {
      status: status,
      dispositifId: dispositif._id,
    };
    API.updateDispositifStatus({ query: newDispositif }).then(() => {
      dispatch(fetchActiveDispositifsActionsCreator());
      dispatch(
        fetchSelectedDispositifActionCreator({
          selectedDispositifId: dispositif._id.toString(),
          locale: router.locale || "fr",
        })
      );
      setDisableEdit(status !== "Accepté structure");
      if (status === "Rejeté structure") {
        router.push("/backend/user-dash-structure");
      }
    });
  };

  const valider_dispositif = (
    status = "En attente",
    auto = false,
    sauvegarde = false,
    saveAndEdit = false,
    continueEditing = true
  ) => {
    if (!dispositif) return;
    setIsDispositifLoading(!auto);

    let content: ShortContent = {
      titreInformatif: h2p(dispositif.titreInformatif),
      titreMarque: h2p(dispositif.titreMarque),
      abstract: h2p(dispositif.abstract),
      contact: h2p(dispositif.contact),
      externalLink: h2p(dispositif.externalLink),
    };

    // do not save automatically when lecture mode
    if (
      auto &&
      //@ts-ignore
      (!Object.keys(content).some((k) => content[k] && content[k] !== contenu[k]) ||
        disableEdit)
    ) {
      return;
    }
    //we delete the infocard geoloc if it's empty
    const children = menu?.[1]?.children || [];
    if (children.length > 0) {
      var geolocInfoCard = children.find((elem) => elem.title === "Zone d'action");
      if (
        geolocInfoCard &&
        (!geolocInfoCard.departments || geolocInfoCard.departments.length < 1)
      ) {
        const index = children.indexOf(geolocInfoCard);
        if (index > -1) {
          children.splice(index, 1);
        }
      }
    }
    let newDispositif: IDispositif = {
      ...dispositif,
      ...content,
      contenu: generateContenu(menu),
      // avancement: 1,
      autoSave: auto,
      lastModificationDate: Date.now()
    };

    if (dispositif._id && dispositif.status !== "Brouillon") {
      newDispositif.timeSpent = time;
    }

    const cardElement = menu.find((x) => x.title === "C'est pour qui ?")?.children || [];

    const audienceAge = cardElement.filter((x) => x.title === "Âge requis");
    //@ts-ignore
    newDispositif.audienceAge = generateAudienceAge(audienceAge);

    if (newDispositif.typeContenu === "dispositif") {
      const niveauFrancais = cardElement.filter((x) => x.title === "Niveau de français");
      //@ts-ignore
      newDispositif.niveauFrancais = niveauFrancais.length > 0
        ? niveauFrancais.map((x) => x.contentTitle)
        : filtres.niveauFrancais;
    } else {
      newDispositif.titreMarque = "";
    }
    if (status !== "Brouillon") {
      if (newDispositif.mainSponsor && user) {
        const membre = (dispositif.mainSponsor?.membres || []).find(
          (x) => x.userId === user._id
        );
        if (
          ((membre &&
            membre.roles &&
            membre.roles.some(
              (x) => x === "administrateur" || x === "contributeur"
            )) || admin) && !sauvegarde
        ) {
          newDispositif.status = "En attente admin";
        }
      } else {
        newDispositif.status = "En attente non prioritaire";
      }
    }

    logger.info("[valider_dispositif] dispositif before call", { newDispositif });
    API.addDispositif(newDispositif).then((data) => {
      const newDispo = data.data.data;
      if (!continueEditing) {
        let text = newDispositif.status === "Brouillon"
            ? "Retrouvez votre fiche dans votre espace « Mes Fiches ». Attention, votre fiche va rester en brouillon. Pour la publier, cliquez sur le bouton valider en vert, plutôt que sur enregistrer."
            : "Retrouvez votre fiche dans votre espace « Mes Fiches ».";

        Swal.fire({
          title: "Fiche enregistrée",
          text: text,
          type: "success",
        });
      }
      if (!auto) {
        Swal.fire("Yay...", "Enregistrement réussi !", "success").then(() => {
          dispatch(fetchUserActionCreator());
          dispatch(fetchActiveDispositifsActionsCreator());
          setDisableEdit([
            "En attente admin",
            "En attente",
            "Brouillon",
            "En attente non prioritaire",
            "Actif",
          ].includes(status) && !saveAndEdit);
          setIsDispositifLoading(false)
          router.push(
            "/" + newDispositif.typeContenu + "/" + newDispo._id
          );
        });
      } else {
        if (isInBrowser()) {
          //@ts-ignore
          NotificationManager.success(
            "Retrouvez votre contribution dans votre page 'Mon profil'",
            "Enregistrement automatique",
            5000,
            () => {
              Swal.fire(
                "Enregistrement automatique",
                "Retrouvez votre contribution dans votre page 'Mon profil'",
                "success"
              );
            }
          );
        }
      }
      dispatch(setSelectedDispositifActionCreator(newDispo));
    });
  };

  const upcoming = () =>
    Swal.fire({
      title: "Oh non!",
      text: "Cette fonctionnalité n'est pas encore disponible",
      type: "error",
      timer: 1500,
    });
  const createPossibleLanguagesObject = (
    avancement: Record<string, number> | undefined,
    langues: Language[]
  ) => {
    if (!dispositif) return langues;
    let possibleLanguages: Language[] = [];
    if (avancement) {
      Object.keys(avancement).forEach((item) => {
        let lng = langues.find(
          (langue) => langue.i18nCode === item && item !== "fr"
        );
        if (lng) possibleLanguages.push(lng);
      });
    }
    return possibleLanguages;
  };

  const changeLanguage = (lng: string) => {
    dispatch(toggleLangueActionCreator(lng));
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: lng });
  }

  const isRTL = useRTL();
  const mainTag = getMainTag(dispositif);
  const tag = mainTag.short.split(" ").join("-");
  const possibleLanguages = createPossibleLanguagesObject(
    dispositif?.avancement,
    langues
  );
  const locale = router.locale || "fr";
  const langueSelected = langues.find(
    (item) => item.i18nCode === locale
  );

  const isTranslated =
    (dispositif &&
      dispositif.avancement &&
      dispositif.avancement[locale] &&
      dispositif.avancement[locale] === 1) ||
    locale === "fr";

  return (
    <div
      id="dispositif"
      className={
        "animated fadeIn dispositif vue" +
        (!disableEdit
          ? " edition-mode"
          : isMobile
          ? ""
          : props.translating
          ? " side-view-mode"
          : printing && isRTL
          ? " printing-mode print-rtl"
          : printing && !isRTL
          ? " printing-mode"
          : " reading-mode")
      }
      ref={newRef}
    >
      <SEO />
      <Row className="main-row">
        {props.translating &&
          {
            /* <Col xl="4" lg="4" md="4" sm="4" xs="4" className="side-col">
              {!this.props.isExpert ? (
                <SideTrad
                  menu={this.state.menu}
                  content={this.state.content}
                  updateUIArray={this.updateUIArray}
                  typeContenu={typeContenu}
                  {...this.props} // TO DO : spread
                />
              ) : (
                <ExpertSideTrad
                  menu={this.state.menu}
                  content={this.state.content}
                  updateUIArray={this.updateUIArray}
                  typeContenu={typeContenu}
                  {...this.props} // TO DO : spread
                />
              )}
            </Col> */
          }}
        <Col
          xl={props.translating ? "8" : "12"}
          lg={props.translating ? "8" : "12"}
          md={props.translating ? "8" : "12"}
          sm={props.translating ? "8" : "12"}
          xs={props.translating ? "8" : "12"}
          className="main-col"
        >
          <section className={styles.banniere + " " + styles[tag]}>
            {!disableEdit && (
              // yellow banner in top of a demarche to create a variante
              // To see this component, create a new demarche then select an existing demarche
              <BandeauEdition
                typeContenu={dispositif?.typeContenu || "dispositif"}
                toggleTutoriel={() => setDisplayTuto(!displayTuto)}
                displayTuto={displayTuto}
                toggleDispositifValidateModal={toggleDispositifValidateModal}
                isModified={isModified}
                isSaved={isSaved}
                toggleDraftModal={() => setShowDraftModal(!showDraftModal)}
                tKeyValue={tKeyValue}
                toggleDispositifCreateModal={() =>
                  setShowDispositifCreateModal(!showDispositifCreateModal)
                }
              />
            )}
            <Row className={styles.row}>
              <div className={styles.back_button}>
                <BackButton goBack={goBack} />
              </div>

              <TopRightHeader
                disableEdit={disableEdit}
                withHelp={withHelp}
                showSpinnerBookmark={showSpinnerBookmark}
                pinned={isPinned(dispositif, user)}
                bookmarkDispositif={bookmarkDispositif}
                toggleHelp={() => setWithHelp(!withHelp)}
                toggleModal={toggleModal}
                toggleDispositifValidateModal={toggleDispositifValidateModal}
                toggleTutoModal={toggleTutorielModal}
                editDispositif={editDispositif}
                valider_dispositif={valider_dispositif}
                toggleDispositifCreateModal={() =>
                  setShowDispositifCreateModal(!showDispositifCreateModal)
                }
                translating={!!props.translating}
                status={dispositif?.status || ""}
                typeContenu={dispositif?.typeContenu || "dispositif"}
                langue={router.locale || "fr"}
                mainTag={mainTag}
                t={t}
              />
            </Row>
            <Col lg="12" md="12" sm="12" xs="12" className={styles.title}>
              <div className={styles.bloc_title}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  {isMobile && (
                    <div>
                      <div className={styles.mobile_title}>
                        <div className={styles.mobile_title_text}>
                          {dispositif?.titreInformatif || ""}
                        </div>
                      </div>
                      {dispositif?.typeContenu === "dispositif" && (
                        <div className={styles.mobile_title_sponsor}>
                          <div className={styles.mobile_title_text}>
                            <span>{t("Dispositif.avec", "avec")}&nbsp;</span>
                            {dispositif?.titreMarque || ""}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {!isMobile && (
                    <div>
                      <h1 className={disableEdit ? "" : "editable"}>
                        {
                          // Display and edition of titreInformatif
                          <ContentEditable
                            id="titreInformatif"
                            html={dispositif?.titreInformatif || ""} // innerHTML of the editable div
                            disabled={disableEdit}
                            onClick={(e) => {
                              if (!disableEdit) {
                                onInputClicked(e);
                              }
                            }}
                            onChange={handleChange}
                            onMouseEnter={(e) => {
                              updateUIArray(-4);
                              //@ts-ignore
                              e.target.focus();
                            }}
                            onKeyPress={(e) => handleKeyPress(e, 0)}
                          />
                        }
                      </h1>
                      {dispositif?.typeContenu === "dispositif" && (
                        <h2 className={styles.bloc_subtitle}>
                          <span>{t("Dispositif.avec", "avec")}&nbsp;</span>
                          {
                            // Display and edition of titreMarque
                            <ContentEditable
                              id="titreMarque"
                              html={dispositif?.titreMarque || ""} // innerHTML of the editable div
                              disabled={disableEdit}
                              onClick={(e) => {
                                onInputClicked(e);
                              }}
                              onChange={handleChange}
                              onKeyDown={onInputClicked}
                              onMouseEnter={(e) => {
                                updateUIArray(-3);
                                //@ts-ignore
                                e.target.focus();
                              }}
                              onKeyPress={(e) => handleKeyPress(e, 1)}
                            />
                          }
                        </h2>
                      )}
                    </div>
                  )}
                  {!disableEdit &&
                    dispositif?.typeContenu === "dispositif" &&
                    displayTuto && (
                      <div style={{ marginTop: "16px" }}>
                        <FButton
                          type="tuto"
                          name={"play-circle-outline"}
                          className="ml-10"
                          onClick={() => toggleTutorielModal("Titre")}
                        >
                          Tutoriel
                        </FButton>
                      </div>
                    )}
                </div>
              </div>
            </Col>
          </section>

          {!isMobile && (
            <Row
              className="tags-row bg-darkColor"
              style={{ backgroundColor: mainTag?.darkColor || "dark" }}
            >
              <Col
                style={{ display: "flex", alignItems: "center" }}
                lg="8"
                md="8"
                sm="8"
                xs="8"
                className="col right-bar"
              >
                {
                  // display En bref banner if content is a dispositif or if content is a demarch but not in edition mode
                  (disableEdit || dispositif?.typeContenu !== "demarche") && (
                    // TO DO : connect component to store when store updated after changing infocards
                    <EnBrefBanner menu={menu} isRTL={isRTL} />
                  )
                }
              </Col>

              <Col lg="4" md="4" sm="4" xs="4" className="tags-bloc">
                {
                  // Tags on the right of a dispositif or a demarche
                  <Tags
                    tags={dispositif?.tags || []}
                    disableEdit={disableEdit}
                    changeTag={changeTag}
                    addTag={addTag}
                    openTag={() => setShowTagsModal(true)}
                    deleteTag={deleteTag}
                    toggleTutorielModal={toggleTutorielModal}
                    displayTuto={displayTuto}
                    updateUIArray={updateUIArray}
                    isRTL={isRTL}
                    t={t}
                    router={router}
                    typeContenu={dispositif?.typeContenu || "dispositif"}
                  />
                }
              </Col>
            </Row>
          )}

          <Row className="no-margin-right">
            {!props.translating && !printing && !isMobile && (
              <Col
                xl="3"
                lg="3"
                md="12"
                sm="12"
                xs="12"
                className="left-side-col pt-40"
              >
                {
                  // left part of the dispositif/demarche to navigate in sections, go to external website, download in pdf, send by mail, by sms and print
                  <LeftSideDispositif
                    menu={menu}
                    showSpinner={showSpinnerPrint}
                    content={getContent(dispositif)}
                    inputBtnClicked={inputBtnClicked}
                    disableEdit={disableEdit}
                    toggleInputBtnClicked={() =>
                      setInputBtnClicked(!inputBtnClicked)
                    }
                    createPdf={createPdf}
                    closePdf={closePdf}
                    newRef={newRef}
                    handleChange={handleChange}
                    typeContenu={dispositif?.typeContenu || "dispositif"}
                    toggleTutorielModal={toggleTutorielModal}
                    displayTuto={displayTuto}
                    updateUIArray={updateUIArray}
                    toggleShowPdfModal={() => setShowPdfModal(!showPdfModal)}
                    mainTag={mainTag}
                  />
                }
              </Col>
            )}

            <Col
              xl={props.translating || printing ? "12" : "7"}
              lg={props.translating || printing ? "12" : "7"}
              md={props.translating || printing ? "12" : "10"}
              sm={props.translating || printing ? "12" : "10"}
              xs="12"
              className="pt-40 col-middle"
              id={"pageContent"}
            >
              {isMobile && (
                //On Mobile device only, button to show modal with sharing options.
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    margin: 10,
                  }}
                >
                  <FButton
                    type="outline-black"
                    name={"share-outline"}
                    onClick={() =>
                      setShowShareContentOnMobileModal(
                        !showShareContentOnMobileModal
                      )
                    }
                  >
                    {t("Dispositif.Partager Fiche", "Partager la Fiche")}
                  </FButton>
                </div>
              )}
              {!isTranslated && showAlertBoxLanguage && (
                <InfoBoxLanguageContainer>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <EVAIcon
                      name={"alert-triangle"}
                      fill={colors.blanc}
                      className="mr-10"
                    ></EVAIcon>
                    <div>
                      {t(
                        "Dispositifs.Cette fiche n'est pas dispo",
                        "Cette fiche n'est pas encore disponible en :"
                      )}
                      {langueSelected
                        ? " " + langueSelected.langueLoc + "."
                        : ""}
                      {possibleLanguages.length
                        ? t(
                            "Dispositifs.Vous pouvez la lire en plusieurs langues",
                            " Vous pouvez la lire en français ou sélectionner une autre langue ci-dessous."
                          )
                        : t(
                            "Dispositifs.Vous pouvez la lire en français",
                            " Vous pouvez la lire en français ci-dessous"
                          )}
                    </div>
                  </div>
                  <EVAIcon
                    onClick={() =>
                      setShowAlertBoxLanguage(!showAlertBoxLanguage)
                    }
                    name={"close"}
                    fill={colors.blanc}
                    className="ml-10"
                  ></EVAIcon>
                </InfoBoxLanguageContainer>
              )}
              <div
                style={
                  isMobile
                    ? {}
                    : {
                        display: "flex",
                        justifyContent: "flex-start",
                        flexWrap: "wrap",
                      }
                }
              >
                {disableEdit && dispositif?.lastModificationDate && (
                  // Part about last update
                  <Row className="fiabilite-row">
                    <Col
                      lg="auto"
                      md="auto"
                      sm="auto"
                      xs="auto"
                      className="col align-right"
                    >
                      {t(
                        "Dispositif.Dernière mise à jour",
                        "Dernière mise à jour"
                      )}{" "}
                      :&nbsp;
                      <span className="date-maj">
                        {moment(dispositif?.lastModificationDate || 0).format(
                          "ll"
                        )}
                      </span>
                    </Col>
                  </Row>
                )}
                {!isTranslated && possibleLanguages.length ? (
                  <TextOtherLanguageContainer>
                    {t("Dispositif.Lire en", "Lire en :")}
                    {langueSelected && isMobile ? (
                      <FButton
                        type="white"
                        className="ml-10 mb-2"
                        onClick={() =>
                          setShowLanguageToReadModal(!showLanguageToReadModal)
                        }
                      >
                        <i
                          className={
                            "flag-icon flag-icon-" +
                            possibleLanguages[0].langueCode
                          }
                          title={possibleLanguages[0].langueCode}
                          id={possibleLanguages[0].langueCode}
                        />

                        <span className="ml-10 language-name">
                          {possibleLanguages[0].langueLoc || "Langue"}
                        </span>
                        <EVAIcon
                          name={"chevron-down-outline"}
                          fill={colors.noir}
                          className="ml-10"
                          size="xlarge"
                        ></EVAIcon>
                      </FButton>
                    ) : langueSelected ? (
                      possibleLanguages.map((langue, index) => {
                        return (
                          <FButton
                            key={index}
                            type="white"
                            className="ml-10 mb-2"
                            onClick={() => {
                              initGA();
                              Event(
                                "CHANGE_LANGUAGE",
                                langue.i18nCode,
                                "label"
                              );
                              changeLanguage(langue.i18nCode);
                            }}
                          >
                            <i
                              className={
                                "flag-icon flag-icon-" + langue.langueCode
                              }
                              title={langue.langueCode}
                              id={langue.langueCode}
                            />

                            <span className="ml-10 language-name">
                              {langue.langueLoc || "Langue"}
                            </span>
                          </FButton>
                        );
                      })
                    ) : null}
                  </TextOtherLanguageContainer>
                ) : null}
              </div>

              <ContenuDispositif
                content={getContent(dispositif)}
                showMapButton={(val: boolean) => setAddMapBtn(val)}
                updateUIArray={updateUIArray}
                handleContentClick={handleContentClick}
                handleMenuChange={handleMenuChange}
                onEditorStateChange={onEditorStateChange}
                toggleModal={toggleModal}
                deleteCard={deleteCard}
                addItem={addItem}
                typeContenu={dispositif?.typeContenu || "dispositif"}
                uiArray={dispositif?.uiArray || []}
                t={t}
                disableEdit={disableEdit}
                menu={menu}
                removeItem={removeItem}
                changeTitle={changeCardTitle}
                toggleNiveau={toggleNiveau}
                changeDepartements={changeDepartements}
                changeAge={changeAge}
                changePrice={changePrice}
                toggleFree={toggleFree}
                setMarkers={setMarkers}
                upcoming={upcoming}
                toggleTutorielModal={toggleTutorielModal}
                displayTuto={displayTuto}
                addMapBtn={addMapBtn}
                printing={printing}
                admin={admin}
                toggleGeolocModal={(val: boolean) => setShowGeolocModal(val)}
                showGeolocModal={showGeolocModal}
                toggleShareContentOnMobileModal={() =>
                  setShowShareContentOnMobileModal(
                    !showShareContentOnMobileModal
                  )
                }
                mainTag={mainTag}
                toggleTooltip={() => setTooltipOpen(!tooltipOpen)}
              />

              {disableEdit && (
                <>
                  {!printing && (
                    <FeedbackFooter
                      pushReaction={pushReaction}
                      didThank={didThank}
                      color={mainTag?.darkColor || "dark"}
                      nbThanks={
                        dispositif?.merci ? dispositif?.merci.length : 0
                      }
                    />
                  )}
                  {!printing && !isMobile && (
                    <div
                      className="discussion-footer bg-darkColor"
                      style={{ backgroundColor: mainTag?.darkColor || "dark" }}
                    >
                      <h5>{t("Dispositif.Avis", "Avis et discussions")}</h5>
                      <span>
                        {t("Bientôt disponible !", "Bientôt disponible !")}
                      </span>
                    </div>
                  )}
                  {[
                    ...(dispositif?.participants || []),
                    dispositif?.creatorId || [],
                  ].length > 0 &&
                    !isMobile &&
                    !printing && (
                      <div className="bottom-wrapper">
                        <ContribCaroussel
                          contributeurs={[
                            ...(dispositif?.participants || []),
                            dispositif?.creatorId || [],
                          ]}
                        />
                      </div>
                    )}
                </>
              )}

              <Sponsors
                ref={sponsorsRef}
                sponsors={dispositif?.sponsors || []}
                mainSponsor={dispositif?.mainSponsor}
                disableEdit={disableEdit}
                addSponsor={addSponsor}
                deleteSponsor={deleteSponsor}
                addMainSponsor={(sponsor: Structure) => dispatch(updateSelectedDispositifActionCreator({mainSponsor: sponsor}))}
                deleteMainSponsor={deleteMainSponsor}
                editSponsor={editSponsor}
                admin={admin}
                validate={toggleDispositifValidateModalFinal}
                finalValidation={finalValidation}
                toggleFinalValidation={() => setFinalValidation(false)}
                toggleTutorielModal={toggleTutorielModal}
                displayTuto={displayTuto}
                updateUIArray={updateUIArray}
                dispositif={dispositif}
                typeContenu={dispositif?.typeContenu}
                toggleDispositifValidateModal={toggleDispositifValidateModal}
                mainTag={mainTag}
              />
            </Col>
            {!isMobile && (
              <Col
                xl="2"
                lg="2"
                md="2"
                sm="2"
                xs="2"
                className={
                  "aside-right pt-40" + (props.translating ? " sideView" : "")
                }
              />
            )}
          </Row>

          <ReactionModal
            showModals={showModals}
            toggleModal={toggleModal}
            onChange={(e: any) => setSuggestion(e.target.value)}
            suggestion={suggestion}
            onValidate={pushReaction}
          />

          <ResponsableModal
            name="responsable"
            show={showModals.responsable}
            toggleModal={toggleModal}
            editDispositif={editDispositif}
            update_status={update_status}
          />
          <RejectionModal
            name="rejection"
            show={showModals.rejection}
            toggleModal={toggleModal}
            update_status={update_status}
          />

          <PdfCreateModal
            createPdf={createPdf}
            show={showPdfModal}
            toggle={() => setShowPdfModal(!showPdfModal)}
            printPdf={printPdf}
            closePdf={closePdf}
            t={t}
            newRef={newRef}
          />

          <BookmarkedModal
            success={isAuth}
            show={showBookmarkModal}
            toggle={() => setShowBookmarkModal(!showBookmarkModal)}
          />
          {dispositif?.typeContenu === "dispositif" && (
            <DispositifCreateModal
              show={showDispositifCreateModal}
              toggle={() =>
                setShowDispositifCreateModal(!showDispositifCreateModal)
              }
              typeContenu={dispositif?.typeContenu}
              navigateToCommentContribuer={() =>
                router.push("/comment-contribuer")
              }
            />
          )}
          <DispositifValidateModal
            show={showDispositifValidateModal}
            typeContenu={dispositif?.typeContenu || ""}
            toggle={toggleDispositifValidateModal}
            abstract={dispositif?.abstract || ""}
            onChange={handleChange}
            titreInformatif={dispositif?.titreInformatif || ""}
            titreMarque={dispositif?.titreMarque || ""}
            validate={valider_dispositif}
            toggleTutorielModal={toggleTutorielModal}
            tags={dispositif?.tags || []}
            mainSponsor={dispositif?.mainSponsor}
            menu={menu}
            toggleTagsModal={() => setShowTagsModal(!showTagsModal)}
            toggleSponsorModal={() =>
              //@ts-ignore
              sponsorsRef.current.toggleModal("responsabilite")
            }
            toggleGeolocModal={(val: boolean) => setShowGeolocModal(val)}
            addItem={addItem}
          />
          <TagsModal
            tags={dispositif?.tags || []}
            validate={validateTags}
            categories={tags}
            show={showTagsModal}
            toggle={() => setShowTagsModal(!showTagsModal)}
            toggleTutorielModal={toggleTutorielModal}
            user={user}
            dispositifId={dispositif?._id.toString() || ""}
          />
          <FrameModal
            show={showTutorielModal}
            toggle={toggleTutorielModal}
            section={tutorielSection}
          />
          <LanguageToReadModal
            show={showLanguageToReadModal}
            toggle={() => setShowLanguageToReadModal(!showLanguageToReadModal)}
            languages={possibleLanguages}
            changeLanguage={changeLanguage}
          />

          <DraftModal
            show={showDraftModal}
            toggle={() => setShowDraftModal(!showDraftModal)}
            valider_dispositif={valider_dispositif}
            navigateToMiddleOffice={() =>
              router.push("/backend/user-dash-contrib")
            }
            status={dispositif?.status || ""}
            toggleIsModified={(val: boolean) => setIsModified(val)}
            toggleIsSaved={(val: boolean) => setIsSaved(val)}
          />
          <ShareContentOnMobileModal
            show={showShareContentOnMobileModal}
            toggle={() =>
              setShowShareContentOnMobileModal(!showShareContentOnMobileModal)
            }
            typeContenu={dispositif?.typeContenu || "dispositif"}
            content={getContent(dispositif)}
            t={t}
          />

          {isInBrowser() && <NotificationContainer />}

          {isDispositifLoading && (
            <div className="ecran-protection no-main">
              <div className="content-wrapper">
                <h1 className="mb-3">{t("Chargement", "Chargement")}...</h1>
                <Spinner color="success" />
              </div>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Dispositif;
