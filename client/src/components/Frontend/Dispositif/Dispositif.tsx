import React, { useEffect, useState, useRef, createRef } from "react";
import { useTranslation } from "next-i18next";
import { Col, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import ContentEditable from "react-contenteditable";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { EditorState, ContentState } from "draft-js";
import moment from "moment";
import "moment/locale/fr";
import Swal from "sweetalert2";
import h2p from "html2plaintext";
import { convertToHTML } from "draft-convert";
import API from "utils/API";
// components
import Sponsors from "components/Frontend/Dispositif/Sponsors";
import ContenuDispositif from "components/Frontend/Dispositif/ContenuDispositif";
import {
  DispositifCreateModal,
  DispositifValidateModal,
  ReactionModal,
  ResponsableModal,
  RejectionModal,
  TagsModal,
  FrameModal,
  DraftModal,
  ShareContentOnMobileModal
} from "components/Modals/index";
import FButton from "components/UI/FButton/FButton";
import Tags from "components/Pages/dispositif/Tags";
import { LanguageToReadModal } from "components/Pages/dispositif/LanguageToReadModal/LanguagetoReadModal";
import LeftSideDispositif from "components/Frontend/Dispositif/LeftSideDispositif";
import BandeauEdition from "components/Frontend/Dispositif/BandeauEdition";
import TopRightHeader from "components/Frontend/Dispositif/TopRightHeader";
import { fetchActiveDispositifsActionsCreator } from "services/ActiveDispositifs/activeDispositifs.actions";
import ContribCaroussel from "components/Pages/dispositif/ContribCaroussel/ContribCaroussel";
import SideTrad from "components/Pages/dispositif/SideTrad/SideTrad";
import ExpertSideTrad from "components/Pages/dispositif/SideTrad/ExpertSideTrad";
import EnBrefBanner from "components/Frontend/Dispositif/EnBrefBanner";
import FeedbackFooter from "components/Frontend/Dispositif/FeedbackFooter";
import { PdfCreateModal } from "components/Modals/PdfCreateModal/PdfCreateModal";
import BackButton from "components/Frontend/Dispositif/BackButton";
import { colors } from "colors";
import SEO from "components/Seo";
// data
import {
  contenu,
  menu as menuDispositif,
  filtres,
  importantCard,
  showModals,
  menuDemarche,
  customConvertOption,
  ShortContent
} from "data/dispositif";
// lib
import isInBrowser from "lib/isInBrowser";
import { Event } from "lib/tracking";
import {
  updateNbViews,
  generateUiArray,
  generateMenu,
  handleContentClickInComponent,
  isPinned,
  generateContenu,
  generateAudienceAge,
  getContent,
  isContentForbidden,
  getMainTheme
} from "lib/dispositifPage";
import { logger } from "logger";
import { initializeTimer } from "containers/Translation/functions";
import { DispositifContent, IDispositif, Language, Structure, Theme } from "types/interface";
import useRTL from "hooks/useRTL";
import { getPath, isRoute, PathNames } from "routes";
// store
import {
  fetchSelectedDispositifActionCreator,
  updateUiArrayActionCreator,
  updateSelectedDispositifActionCreator,
  setUiArrayActionCreator,
  setSelectedDispositifActionCreator
} from "services/SelectedDispositif/selectedDispositif.actions";
import { userSelector } from "services/User/user.selectors";
import { fetchUserActionCreator } from "services/User/user.actions";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import { userDetailsSelector } from "services/User/user.selectors";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import { toggleLangueActionCreator } from "services/Langue/langue.actions";
import { UiElementNodes } from "services/SelectedDispositif/selectedDispositif.reducer";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
// style
import styles from "scss/pages/dispositif.module.scss";
import mobile from "scss/components/mobile.module.scss";
import { cls } from "lib/classname";
import { isUserAllowedToModify } from "./TopRightHeader/functions";
import { themesSelector } from "services/Themes/themes.selectors";
import { toggleUserFavoritesModalActionCreator } from "services/UserFavoritesInLocale/UserFavoritesInLocale.actions";

moment.locale("fr");

let htmlToDraft: any = null;
let NotificationManager: any = null;
let NotificationContainer: any = null;
if (isInBrowser()) {
  htmlToDraft = require("html-to-draftjs").default;
  const ReactNotifications = require("react-notifications/dist/react-notifications.js");
  NotificationManager = ReactNotifications.NotificationManager;
  NotificationContainer = ReactNotifications.NotificationContainer;
}

const uiElement = {
  isHover: false,
  accordion: false,
  cardDropdown: false,
  addDropdown: false,
  varianteSelected: false
};
const initialShowModals = showModals;
const MAX_NUMBER_CHARACTERS_INFOCARD = 40;

interface Props {
  type: "detail" | "create" | "translation";
  typeContenu: "dispositif" | "demarche";
  history: string[];

  // translation
  translate?: (text: any, target: any, item: any, toEditor?: boolean) => void;
  handleChange?: (ev: any) => void;
  valider?: (tradData?: {}) => Promise<void>;
  onEditorStateChange?: (editorState: any, target?: string) => void;
  onSkip?: () => void;
  fwdSetState?: (fn: any, cb: any) => false | void;
  isExpert?: boolean;
  translated?: {
    body: string;
    title: string;
  };
  locale?: string;
  langue?: any;
  traduction?: {
    initialText: { contenu: any[] };
    translatedText: { contenu: any[] };
  };
  francais?: any;
  traductionsFaites?: any[];
  autosuggest?: boolean;
  translations?: any;
  translation?: any;
}

const Dispositif = (props: Props) => {
  const newRef = useRef<HTMLDivElement>(null);
  const sponsorsRef = createRef<any>();

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
  const [tSubkey, setTSubkey] = useState<number | null>(-1);
  const [withHelp, setWithHelp] = useState(process.env.NODE_ENV !== "development");
  const [inputBtnClicked, setInputBtnClicked] = useState(false);
  const [time, setTime] = useState(0);
  const [printing, setPrinting] = useState(false);
  const [didThank, setDidThank] = useState(false);
  const [finalValidation, setFinalValidation] = useState(false);
  const [tutorielSection, setTutorielSection] = useState("");
  const [displayTuto, setDisplayTuto] = useState(true);
  const [addMapBtn, setAddMapBtn] = useState(true);
  const [routeAfterSave, setRouteAfterSave] = useState("");

  // Modals
  const [showModals, setShowModals] = useState(initialShowModals);
  const [showDispositifCreateModal, setShowDispositifCreateModal] = useState(false);
  const [showDispositifValidateModal, setShowDispositifValidateModal] = useState(false);
  const [showGeolocModal, setShowGeolocModal] = useState(false);
  const [showLanguageToReadModal, setShowLanguageToReadModal] = useState(false);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showTutorielModal, setShowTutorielModal] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [showShareContentOnMobileModal, setShowShareContentOnMobileModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const dispositif = useSelector(selectedDispositifSelector); // loaded by serverSideProps
  const user = useSelector(userDetailsSelector);
  const isUserLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_USER));
  const isUserStructureLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_USER_STRUCTURE));
  const admin = useSelector(userSelector)?.admin;
  const langues = useSelector(allLanguesSelector);

  // Initial data
  const [menu, setMenu] = useState<DispositifContent[]>(dispositif ? generateMenu(dispositif) : []);
  const timer = useRef<number | undefined>();

  useEffect(() => {
    if ((API.isAuth() && !user) || isLoaded) return;

    if (props.type === "detail") {
      // DETAIL
      if (dispositif) {
        updateNbViews(dispositif);

        // case dispositif not active and user neither admin nor contributor nor in structure
        if (isContentForbidden(dispositif, admin, user)) {
          // TODO: not secure
          router.push(user ? "/" : getPath("/login", router.locale));
          return;
        }
        /* WHY THIS?
        const secondarySponsor = dispositif.sponsors.filter((sponsor) => !sponsor._id && sponsor.nom);
        const sponsors = secondarySponsor || []; */
      }
    } else if (props.type === "translation") {
      // TRANSLATION
      if (dispositif) {
        // case dispositif not active and user neither admin nor contributor nor in structure
        if (isContentForbidden(dispositif, admin, user)) {
          // TODO: not secure
          router.push(user ? "/" : getPath("/login", router.locale));
          return;
        }
        /* WHY THIS?
        const secondarySponsor = dispositif.sponsors.filter((sponsor) => !sponsor._id && sponsor.nom);
        const sponsors = secondarySponsor || []; */
      }
    } else if (props.type === "create") {
      // CREATE
      const isAuth = API.isAuth();
      if (isAuth) {
        // initialize the creation of a new dispositif if user is logged in
        const menuContenu = props.typeContenu === "demarche" ? menuDemarche : menuDispositif;
        let emptyDispositif: IDispositif = {
          //@ts-ignore
          _id: "",
          abstract: contenu.abstract,
          audience: [],
          audienceAge: [],
          autoSave: false,
          //@ts-ignore
          avancement: 1,
          bravo: [],
          contact: contenu.contact,
          contenu: [],
          created_at: moment(),
          //@ts-ignore
          externalLink: contenu.abstract,
          //@ts-ignore
          mainSponsor: null,
          merci: [],
          nbMots: 0,
          niveauFrancais: props.typeContenu === "demarche" ? undefined : [],
          participants: [],
          signalements: [],
          sponsors: [],
          status: "Brouillon",
          suggestions: [],
          //@ts-ignore
          theme: null,
          secondaryThemes: [],
          titreInformatif: contenu.titreInformatif,
          titreMarque: contenu.titreMarque,
          typeContenu: props.typeContenu,
          updatedAt: moment(),
          nbVues: 0,
          nbMercis: 0,
          adminProgressionStatus: "Nouveau !"
        };
        setDisableEdit(false);
        setShowDispositifCreateModal(true);
        setMenu(
          menuContenu.map((x) => {
            return {
              ...x,
              type: x.type || "paragraphe",
              isFakeContent: true,
              content: x.type ? null : x.content,
              editorState: EditorState.createWithContent(
                ContentState.createFromBlockArray(htmlToDraft("").contentBlocks)
              )
            };
          })
        );
        dispatch(setSelectedDispositifActionCreator(emptyDispositif, true));
        dispatch(setUiArrayActionCreator(generateUiArray(menuContenu, true)));
      } else {
        router.push(getPath("/login", router.locale));
      }
    }
    setIsLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Reload page when dispositif changes
  useEffect(() => {
    if (dispositif?._id && props.type !== "create") {
      setMenu(generateMenu(dispositif));
      setDisableEdit(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispositif?._id]);

  const editDispositif = () => {
    if (!dispositif) return;
    setDisableEdit(false);
    const newUiArray = [...menu].map((x, i) => ({
      ...uiElement,
      ...(dispositif.uiArray.length > i && {
        varianteSelected: dispositif.uiArray[i].varianteSelected
      }),
      ...(x.children && {
        children: x.children.map((_, j) => ({
          ...uiElement,
          ...(dispositif.uiArray.length > i &&
            dispositif.uiArray[i] &&
            dispositif.uiArray[i].children &&
            (dispositif.uiArray[i].children || []).length > j && {
              varianteSelected: dispositif.uiArray[i]?.children?.[j]?.varianteSelected
            }),
          accordion: true
        }))
      })
    }));
    dispatch(setUiArrayActionCreator(newUiArray));
  };

  // enter edition mode if edit param
  useEffect(() => {
    const isUserAllowedToModifyDispositif = isUserAllowedToModify(admin, user, dispositif);
    if (isUserAllowedToModifyDispositif && router.query.edit === "") {
      editDispositif();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Use autosave in a ref to mutate it when dispositif is updated
  const autoSave = () => {
    // eslint-disable-next-line no-use-before-define
    saveDispositif(true, "auto");
  };
  const autoSaveRef = React.useRef(autoSave);
  useEffect(() => {
    autoSaveRef.current = autoSave;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispositif, menu]);

  // Auto-save
  useEffect(() => {
    if (
      !disableEdit && // if edition
      ["Brouillon", ""].includes(dispositif?.status || "") // and Brouillon
    ) {
      if (timer.current) clearInterval(timer.current);
      timer.current = initializeTimer(3 * 60 * 1000, () => {
        autoSaveRef.current();
      });
    }

    const hasEditParam = router.query.edit === "";
    if (
      dispositif?._id &&
      ((hasEditParam && disableEdit) || (!hasEditParam && !disableEdit)) // needs redirect
    ) {
      const route = props.typeContenu === "demarche" ? "/demarche/[id]" : "/dispositif/[id]";
      const id = dispositif._id.toString();
      router.replace(
        {
          pathname: getPath(route, router.locale),
          query: { id }
        },
        router.asPath + (disableEdit ? "" : "?edit"),
        { shallow: true }
      );
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disableEdit]);

  const onInputClicked = (ev: any) => {
    // when clicking on titreInformatif or titreMarque (name of asso)
    // if titre informatif is 'Titre informatif' we store "" instead of titre informatif
    // same for titre marque

    const id = ev.currentTarget.id;
    if (
      !disableEdit &&
      ((id === "titreInformatif" && dispositif?.titreInformatif === contenu.titreInformatif) ||
        (id === "titreMarque" && dispositif?.titreMarque === contenu.titreMarque))
    ) {
      dispatch(updateSelectedDispositifActionCreator({ [id]: "" }));
    }
  };

  const handleChange = (ev: any) => {
    const value = ev.target.value;
    dispatch(updateSelectedDispositifActionCreator({ [ev.currentTarget.id]: value }));
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

  const handleMenuChange = (ev: any, value: any = null) => {
    setMenu((menu) => {
      const node = ev.currentTarget;
      let newMenu = [...menu];
      newMenu[node.id] = {
        ...newMenu[node.id],
        ...(!node.dataset.subkey && {
          [(node.dataset || {}).target || "content"]: value || (value === null && ev.target.value),
          isFakeContent: false
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
                      ? ev.target.value.substring(0, MAX_NUMBER_CHARACTERS_INFOCARD)
                      : ev.target.value),
                  isFakeContent: false
                })
              };
            })
          })
      };
      return newMenu;
    });
    setIsModified(true);
  };

  const updateUIArray = (key: number, subkey: number | null = null, node: UiElementNodes = "isHover", value = true) => {
    if (!dispositif) return;
    let newUiArray = [...dispositif.uiArray];

    // return if no changes
    if (newUiArray[key]) {
      if (subkey === null && newUiArray[key][node] === value) return; // if no subkey
      if (subkey !== null && (newUiArray[key].children || [])[subkey]?.[node] === value) return; // if subkey
    }

    const updateOthers = node !== "varianteSelected" && (disableEdit || node !== "accordion");
    newUiArray = newUiArray.map((x, idx) => {
      return {
        ...x,
        ...((subkey === null && idx === key && { [node]: value }) || (updateOthers && { [node]: false })),
        ...(x.children && {
          children: x.children.map((y: any, subidx: number) => {
            return {
              ...y,
              ...((subidx === subkey && idx === key && { [node]: value }) || (updateOthers && { [node]: false }))
            };
          })
        })
      };
    });

    dispatch(updateUiArrayActionCreator({ subkey, key, node, value, updateOthers }));
    setTKeyValue(key);
    setTSubkey(subkey);
  };

  const handleContentClick = (key: number, editable: boolean, subkey: number | undefined = undefined) => {
    setMenu((menu) => {
      const newMenu = handleContentClickInComponent(menu, disableEdit, key, editable, subkey);
      if (newMenu) {
        let right_node = newMenu[key];
        if (subkey !== undefined && (newMenu[key]?.children || []).length > subkey) {
          right_node = (newMenu[key]?.children || [])[subkey];
        }
        if (right_node.type === "accordion") {
          updateUIArray(key, subkey, "accordion", true);
        }
        return newMenu;
      }
      return menu;
    });
  };

  const onEditorStateChange = (editorState: EditorState, key: number, subkey: number | null = null) => {
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
            content: content
          };
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

  const addItem = (key: number, type = "paragraphe", subkey: string | number | null = null) => {
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
      content: ""
    };
    const children = prevState[key]?.children || [];
    if (children.length > 0) {
      let newChild = { ...children[children.length - 1] };
      if (type === "card" && newChild.type !== "card") {
        prevState[key].type = "cards";
        newChild = importantCard;
      } else if (type === "card") {
        const menuFiche = dispositif.typeContenu === "dispositif" ? menuDispositif : menuDemarche;
        // the new child is an infocard which title is subkey (a title that is not already displayed)
        newChild = (menuFiche[1]?.children || []).filter((x) => x.title === subkey)?.[0] || importantCard;

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
            content: ""
          };
        }
      } else if (type === "accordion") {
        newChild = {
          type: "accordion",
          isFakeContent: true,
          content: "",
          title: ""
        };
      } else if (type === "map") {
        newChild = {
          type: "map",
          isFakeContent: true,
          isMapLoaded: false,
          markers: [],
          title: "",
          content: ""
        };
        setAddMapBtn(false);
      } else if (type === "paragraph" && !newChild.content) {
        newChild = {
          title: "Un exemple de paragraphe",
          isFakeContent: true,
          content: "",
          type: type
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
          content: ""
        };
      }
      newChild.type = type;
      if (subkey === null || subkey === undefined || subkey === "Zone d'action") {
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
            content: ""
          }
        ];
      } else if (type === "map") {
        prevState[key].children = [
          {
            type: "map",
            isFakeContent: true,
            isMapLoaded: false,
            markers: [],
            content: "",
            title: ""
          }
        ];
      } else {
        prevState[key].children = [
          {
            title: "Nouveau sous-paragraphe",
            type: type,
            editable: false,
            content: ""
          }
        ];
      }
    }
    newUiArray[key].children = [
      ...(newUiArray[key].children || []),
      { ...uiElement, accordion: true, varianteSelected: true }
    ];
    setMenu(prevState);
    dispatch(setUiArrayActionCreator(newUiArray));
  };

  const removeItem = (key: number, subkey: number | null = null) => {
    if (!dispositif) return;
    let prevState = [...menu];
    let newUiArray = [...dispositif.uiArray];
    const children = prevState[key].children;
    if (children && children.length > 0 && (children.length > 1 || prevState[key].content)) {
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
    prevState[key].children = (prevState[key].children || []).filter((_, i) => i !== subkey);
    setMenu(prevState);
    setIsModified(true);
  };

  const toggleNiveau = (selectedLevels: any, key: number, subkey: number) => {
    setMenu(
      [...menu].map((x, i) =>
        i === key
          ? {
              ...x,
              children: (x.children || []).map((y, ix) => (ix === subkey ? { ...y, niveaux: selectedLevels } : y))
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
                ix === subkey ? { ...y, free: !y.free, isFakeContent: false } : y
              )
            }
          : x
      )
    );
    setIsModified(true);
  };
  const changeDepartements = (departments: any, key: number, subkey: number) => {
    setMenu(
      [...menu].map((x, i) =>
        i === key
          ? {
              ...x,
              children: (x.children || []).map((y, ix) =>
                ix === subkey ? { ...y, departments: departments, isFakeContent: false } : y
              )
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
                ix === subkey ? { ...y, price: e.target.value, isFakeContent: false } : y
              )
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
                      [isBottom ? "bottomValue" : "topValue"]: (e.target.value || "").replace(/\D/g, ""),
                      isFakeContent: false
                    }
                  : y
              )
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
              children: (x.children || []).map((y, ix) => (ix === subkey ? { ...y, markers, isFakeContent: false } : y))
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
      if (!newUser.cookies) newUser.cookies = {};
      if (pinned) {
        newUser.cookies.dispositifsPinned = (user?.cookies?.dispositifsPinned || []).filter(
          (x) => x._id !== dispositif._id.toString()
        );
      } else {
        newUser.cookies.dispositifsPinned = [
          ...(user?.cookies?.dispositifsPinned || []),
          { _id: dispositif._id.toString(), datePin: moment() }
        ];
      }

      API.set_user_info(newUser).then(() => {
        dispatch(fetchUserActionCreator());
        setShowSpinnerBookmark(false);
        dispatch(toggleUserFavoritesModalActionCreator(!pinned));
        setIsAuth(true);
      });
    } else {
      setShowSpinnerBookmark(false);
      dispatch(toggleUserFavoritesModalActionCreator(true));
      setIsAuth(false);
    }
  };
  const changeCardTitle = (key: number, subkey: number, node: string, value: string) => {
    const prevState = [...menu];
    if (node === "title") {
      const newContent = (menuDispositif[1].children || []).concat(importantCard).find((x: any) => x.title === value);
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

  // THEMES
  const themes = useSelector(themesSelector);
  const validateThemes = (theme: Theme | null, secondaryThemes: Theme[]) => {
    const newDispositif: Partial<IDispositif> = { secondaryThemes };
    if (theme) newDispositif.theme = theme;
    dispatch(updateSelectedDispositifActionCreator(newDispositif));
  };

  // SPONSORS
  const addSponsor = (sponsor: Partial<Structure>) => {
    const newSponsors = [...(dispositif?.sponsors || []), sponsor];
    //@ts-ignore
    dispatch(updateSelectedDispositifActionCreator({ sponsors: newSponsors }));
  };
  const editSponsor = (key: number, sponsor: Partial<Structure>) => {
    const newItems = [...(dispositif?.sponsors || [])];
    //@ts-ignore
    newItems[key] = sponsor;
    dispatch(updateSelectedDispositifActionCreator({ sponsors: newItems }));
  };
  const deleteSponsor = (key: number) => {
    if (!dispositif) return;
    const status = dispositif.status;
    if ((status === "Accepté structure" || status === "Actif" || status === "En attente admin") && !admin) {
      Swal.fire({
        title: "Oh non!",
        text: "Vous ne pouvez plus supprimer de structures partenaires",
        type: "error",
        timer: 1500
      });
      return;
    }
    dispatch(
      updateSelectedDispositifActionCreator({
        sponsors: (dispositif.sponsors || []).filter((_, i) => i !== key)
      })
    );
  };
  const deleteMainSponsor = () => {
    if (!dispositif) return;
    const status = dispositif.status;
    if ((status === "Accepté structure" || status === "Actif" || status === "En attente admin") && !admin) {
      Swal.fire({
        title: "Oh non!",
        text: "Vous ne pouvez plus supprimer de structures partenaires",
        type: "error",
        timer: 1500
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
        timer: 1500
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
    if (props.history[1] && isRoute(props.history[1], "/recherche")) {
      router.push(props.history[1]);
    } else {
      router.push({ pathname: getPath("/recherche", router.locale) });
    }
  };

  // PDF
  const closePdf = () => {
    setShowSpinnerPrint(false);
    setPrinting(false);
  };
  const createPdf = () => {
    if (!dispositif) return;
    Event("EXPORT_PDF", router.locale || "fr", "label");
    setShowSpinnerPrint(true);
    setPrinting(true);
  };
  const printPdf = () => {
    if (isInBrowser()) window.print();
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
      ...(suggestion && { suggestion: h2p(suggestion) })
    };

    API.updateDispositifReactions(newDispositif).then(() => {
      Swal.fire({
        title: "Yay...",
        text: "Votre réaction a bien été enregistrée, merci",
        type: "success",
        timer: 1500
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
      dispositifId: dispositif._id
    };
    API.updateDispositifStatus({ query: newDispositif }).then(() => {
      dispatch(fetchActiveDispositifsActionsCreator());
      dispatch(
        fetchSelectedDispositifActionCreator({
          selectedDispositifId: dispositif._id.toString(),
          locale: router.locale || "fr"
        })
      );
      setDisableEdit(status !== "Accepté structure");
      if (status === "Rejeté structure") {
        router.push("/backend/user-dash-structure");
      }
    });
  };

  const saveDispositif = (
    continueEditing = true,
    saveType: "auto" | "validate" | "save" = "save",
    routeAfterSave = ""
  ) => {
    if (!dispositif) return;
    const auto = saveType === "auto";

    let content: ShortContent = {
      titreInformatif: h2p(dispositif.titreInformatif),
      titreMarque: h2p(dispositif.titreMarque),
      abstract: h2p(dispositif.abstract),
      contact: h2p(dispositif.contact),
      externalLink: h2p(dispositif.externalLink)
    };

    // do not save automatically when lecture mode
    if (
      auto &&
      //@ts-ignore
      (!Object.keys(content).some((k) => content[k] && content[k] !== contenu[k]) || disableEdit)
    ) {
      return;
    }
    //we delete the infocard geoloc if it's empty
    const children = menu?.[1]?.children || [];
    if (children.length > 0) {
      var geolocInfoCard = children.find((elem) => elem.title === "Zone d'action");
      if (geolocInfoCard && (!geolocInfoCard.departments || geolocInfoCard.departments.length < 1)) {
        const index = children.indexOf(geolocInfoCard);
        if (index > -1) {
          children.splice(index, 1);
        }
      }
    }
    let newDispositif: Partial<IDispositif> = {
      ...dispositif,
      ...content,
      contenu: generateContenu(menu),
      autoSave: auto,
      lastModificationDate: Date.now(),
      dispositifId: dispositif._id,
      //@ts-ignore
      avancement: 1,
      saveType: saveType
    };

    if (dispositif._id && dispositif.status !== "Brouillon") {
      newDispositif.timeSpent = time;
    }

    if (newDispositif?._id?.toString() === "") {
      // for creation
      delete newDispositif._id;
    }

    const cardElement = menu.find((x) => x.title === "C'est pour qui ?")?.children || [];

    const audienceAge = cardElement.filter((x) => x.title === "Âge requis");
    //@ts-ignore
    newDispositif.audienceAge = generateAudienceAge(audienceAge);

    if (newDispositif.typeContenu === "dispositif") {
      const niveauFrancais = cardElement.filter((x) => x.title === "Niveau de français");
      //@ts-ignore
      newDispositif.niveauFrancais =
        niveauFrancais.length > 0 ? niveauFrancais.map((x) => x.contentTitle) : filtres.niveauFrancais;
    } else {
      newDispositif.titreMarque = "";
    }

    logger.info("[saveDispositif] dispositif before call", { newDispositif });
    API.addDispositif(newDispositif).then((data) => {
      const newDispo = data.data.data;
      delete newDispo.mainSponsor; // fix different return data between addDispositif and get_dispositif
      if (!continueEditing) {
        let text =
          newDispositif.status === "Brouillon"
            ? "Retrouvez votre fiche dans votre espace « Mes Fiches ». Attention, votre fiche va rester en brouillon. Pour la publier, cliquez sur le bouton valider en vert, plutôt que sur enregistrer."
            : "Retrouvez votre fiche dans votre espace « Mes Fiches ».";

        Swal.fire({
          title: "Fiche enregistrée",
          text: text,
          type: "success"
        });
      }
      dispatch(fetchUserActionCreator()); // fetch user to get new contributions
      if (!auto) {
        Swal.fire("Yay...", "Enregistrement réussi !", "success").then(() => {
          dispatch(fetchActiveDispositifsActionsCreator());

          const continueAfterCreation = continueEditing && props.type === "create";
          const nextRoute = routeAfterSave || "/" + newDispositif.typeContenu + "/" + newDispo._id;
          if (continueAfterCreation) {
            setRouteAfterSave(nextRoute + "?edit");
          } else if (!continueEditing) {
            setRouteAfterSave(nextRoute);
          }

          setDisableEdit(
            ["En attente admin", "En attente", "Brouillon", "En attente non prioritaire", "Actif"].includes(
              newDispo.status
            ) && !continueEditing
          );
        });
      } else {
        if (isInBrowser()) {
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
        setIsSaved(true);
        setIsModified(false);
      }
      dispatch(setSelectedDispositifActionCreator(newDispo, false, !disableEdit));
    });
  };

  // when finish loading user after save, redirect
  useEffect(() => {
    if (routeAfterSave !== "" && !isUserLoading && !isUserStructureLoading && user) {
      router.push(routeAfterSave);
      setRouteAfterSave("");
    }
  }, [routeAfterSave, router, isUserLoading, isUserStructureLoading, user]);

  const upcoming = () =>
    Swal.fire({
      title: "Oh non!",
      text: "Cette fonctionnalité n'est pas encore disponible",
      type: "error",
      timer: 1500
    });
  const createPossibleLanguagesObject = (avancement: Record<string, number> | undefined, langues: Language[]) => {
    if (!dispositif) return langues;
    let possibleLanguages: Language[] = [];
    if (avancement) {
      Object.keys(avancement).forEach((item) => {
        let lng = langues.find((langue) => langue.i18nCode === item && item !== "fr");
        if (lng) possibleLanguages.push(lng);
      });
    }
    return possibleLanguages;
  };

  const changeLanguage = (lng: string) => {
    dispatch(toggleLangueActionCreator(lng));

    const { pathname, query } = router;
    router.push(
      {
        pathname: getPath(pathname as PathNames, lng),
        query
      },
      undefined,
      { locale: lng }
    );
  };

  const isRTL = useRTL();
  const mainTheme = getMainTheme(dispositif);
  const possibleLanguages = createPossibleLanguagesObject(dispositif?.avancement, langues);
  const locale = router.locale || "fr";
  const langueSelected = langues.find((item) => item.i18nCode === locale);

  const isTranslated =
    (dispositif && dispositif.avancement && dispositif.avancement[locale] && dispositif.avancement[locale] === 1) ||
    locale === "fr";

  return (
    <div
      id="dispositif"
      className={
        "animated fadeIn dispositif vue" +
        (!disableEdit
          ? " edition-mode"
          : props.type === "translation"
          ? " side-view-mode"
          : printing && isRTL
          ? " printing-mode print-rtl"
          : printing && !isRTL
          ? " printing-mode"
          : " reading-mode")
      }
      dir={isRTL ? "rtl" : "ltr"} // needed here for printing
      ref={newRef}
    >
      <SEO
        title={dispositif?.titreMarque || dispositif?.titreInformatif || ""}
        description={dispositif?.abstract || ""}
        image={dispositif?.theme?.shareImage.secure_url}
      />
      <Row className={styles.main}>
        {props.type === "translation" && (
          <Col xl="4" lg="4" md="4" sm="4" xs="4">
            {user &&
              (!props.isExpert ? (
                <SideTrad
                  menu={menu}
                  content={getContent(dispositif)}
                  updateUIArray={updateUIArray}
                  typeContenu={dispositif?.typeContenu || "dispositif"}
                  translated={props.translated}
                  isExpert={props.isExpert}
                  locale={props.locale}
                  langue={props.langue}
                  traduction={props.traduction}
                  francais={props.francais}
                  traductionsFaites={props.traductionsFaites}
                  autosuggest={props.autosuggest}
                  translations={props.translations}
                  translation={props.translation}
                  translate={props.translate}
                  fwdSetState={props.fwdSetState}
                  handleChange={props.fwdSetState}
                  valider={props.valider}
                  onEditorStateChange={props.onEditorStateChange}
                  onSkip={props.onSkip}
                  user={user}
                />
              ) : (
                <ExpertSideTrad
                  menu={menu}
                  content={getContent(dispositif)}
                  updateUIArray={updateUIArray}
                  typeContenu={dispositif?.typeContenu || "dispositif"}
                  translated={props.translated}
                  dispositifId={dispositif?._id}
                  isExpert={props.isExpert}
                  locale={props.locale}
                  langue={props.langue}
                  traduction={props.traduction}
                  francais={props.francais}
                  traductionsFaites={props.traductionsFaites}
                  autosuggest={props.autosuggest}
                  translations={props.translations}
                  translation={props.translation}
                  translate={props.translate}
                  fwdSetState={props.fwdSetState}
                  handleChange={props.handleChange}
                  valider={props.valider}
                  onEditorStateChange={props.onEditorStateChange}
                  onSkip={props.onSkip}
                  user={user}
                />
              ))}
          </Col>
        )}
        <Col
          xl={props.type === "translation" ? "8" : "12"}
          lg={props.type === "translation" ? "8" : "12"}
          md={props.type === "translation" ? "8" : "12"}
          sm={props.type === "translation" ? "8" : "12"}
          xs={props.type === "translation" ? "8" : "12"}
          className="main-col"
        >
          <section
            className={cls(styles.banniere, !dispositif?.theme?.banner.secure_url && styles.no_image)}
            style={mainTheme.banner.secure_url ? { backgroundImage: `url(${mainTheme.banner.secure_url})` } : {}}
          >
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
                toggleDispositifCreateModal={() => setShowDispositifCreateModal(!showDispositifCreateModal)}
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
                toggleDispositifCreateModal={() => setShowDispositifCreateModal(!showDispositifCreateModal)}
                translating={props.type === "translation"}
                status={dispositif?.status || ""}
                typeContenu={dispositif?.typeContenu || "dispositif"}
                langue={router.locale || "fr"}
                mainTheme={mainTheme}
              />
            </Row>
            <Col lg="12" md="12" sm="12" xs="12" className={styles.title}>
              <div className={styles.bloc_title}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row"
                  }}
                >
                  <div className={mobile.visible}>
                    <div className={styles.mobile_title}>
                      <div className={styles.mobile_title_text}>{dispositif?.titreInformatif || ""}</div>
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
                  <div className={mobile.hidden}>
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
                  {!disableEdit && dispositif?.typeContenu === "dispositif" && displayTuto && (
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

          <Row
            className={cls(mobile.hidden_flex, "tags-row bg-darkColor")}
            style={{ backgroundColor: mainTheme.colors.color100 }}
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
                // Themes on the right of a dispositif or a demarche
                <Tags
                  theme={dispositif?.theme}
                  secondaryThemes={dispositif?.secondaryThemes || []}
                  disableEdit={disableEdit}
                  openTag={() => setShowTagsModal(true)}
                  toggleTutorielModal={toggleTutorielModal}
                  displayTuto={displayTuto}
                  updateUIArray={updateUIArray}
                  isRTL={isRTL}
                  typeContenu={dispositif?.typeContenu || "dispositif"}
                />
              }
            </Col>
          </Row>

          <Row className="no-margin-right">
            {props.type !== "translation" && !printing && (
              <Col xl="3" lg="3" md="12" sm="12" xs="12" className={cls(mobile.hidden, "left-side-col pt-40")}>
                {
                  // left part of the dispositif/demarche to navigate in sections, go to external website, download in pdf, send by mail, by sms and print
                  <LeftSideDispositif
                    menu={menu}
                    showSpinner={showSpinnerPrint}
                    content={getContent(dispositif)}
                    inputBtnClicked={inputBtnClicked}
                    disableEdit={disableEdit}
                    toggleInputBtnClicked={() => setInputBtnClicked(!inputBtnClicked)}
                    createPdf={createPdf}
                    closePdf={closePdf}
                    newRef={newRef}
                    handleChange={handleChange}
                    typeContenu={dispositif?.typeContenu || "dispositif"}
                    toggleTutorielModal={toggleTutorielModal}
                    displayTuto={displayTuto}
                    updateUIArray={updateUIArray}
                    toggleShowPdfModal={() => setShowPdfModal(!showPdfModal)}
                    mainTheme={mainTheme}
                  />
                }
              </Col>
            )}

            <Col
              lg={props.type === "translation" || printing ? "12" : "7"}
              md={props.type === "translation" || printing ? "12" : "10"}
              xs="12"
              className="pt-40 col-middle"
              id={"pageContent"}
            >
              <div
                className={mobile.visible_flex}
                style={{
                  justifyContent: "center",
                  margin: 10
                }}
              >
                <FButton
                  type="outline-black"
                  name={"share-outline"}
                  onClick={() => setShowShareContentOnMobileModal(!showShareContentOnMobileModal)}
                >
                  {t("Dispositif.Partager Fiche", "Partager la Fiche")}
                </FButton>
              </div>
              {!isTranslated && showAlertBoxLanguage && (
                <div className={styles.infobox}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <EVAIcon name={"alert-triangle"} fill={colors.gray10} className="mr-10"></EVAIcon>
                    <div>
                      {t("Dispositifs.Cette fiche n'est pas dispo", "Cette fiche n'est pas encore disponible en :")}
                      {langueSelected ? " " + langueSelected.langueLoc + "." : ""}
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
                    onClick={() => setShowAlertBoxLanguage(!showAlertBoxLanguage)}
                    name={"close"}
                    fill={colors.gray10}
                    className="ml-10"
                  ></EVAIcon>
                </div>
              )}
              <div className={styles.informations}>
                {disableEdit && dispositif?.lastModificationDate && (
                  // Part about last update
                  <Row className="fiabilite-row">
                    <Col xs="auto" className="col align-right">
                      {t("Dispositif.Dernière mise à jour", "Dernière mise à jour")} :&nbsp;
                      <span className="date-maj">{moment(dispositif?.lastModificationDate || 0).format("ll")}</span>
                    </Col>
                  </Row>
                )}
                {!isTranslated && possibleLanguages.length ? (
                  <div className={styles.other_language}>
                    {t("Dispositif.Lire en", "Lire en :")}
                    {langueSelected && (
                      <>
                        <FButton
                          type="white"
                          className={cls(mobile.visible_inline_flex, "ml-10 mb-2")}
                          onClick={() => setShowLanguageToReadModal(!showLanguageToReadModal)}
                        >
                          <i
                            className={"flag-icon flag-icon-" + possibleLanguages[0].langueCode}
                            title={possibleLanguages[0].langueCode}
                            id={possibleLanguages[0].langueCode}
                          />

                          <span className="ml-10 language-name">{possibleLanguages[0].langueLoc || "Langue"}</span>
                          <EVAIcon
                            name={"chevron-down-outline"}
                            fill={colors.gray90}
                            className="ml-10"
                            size="xlarge"
                          ></EVAIcon>
                        </FButton>

                        <div className={mobile.hidden}>
                          {possibleLanguages.map((langue, index) => {
                            return (
                              <FButton
                                key={index}
                                type="white"
                                className="ml-10 mb-2"
                                onClick={() => {
                                  Event("CHANGE_LANGUAGE", langue.i18nCode, "label");
                                  changeLanguage(langue.i18nCode);
                                }}
                              >
                                <i
                                  className={"flag-icon flag-icon-" + langue.langueCode}
                                  title={langue.langueCode}
                                  id={langue.langueCode}
                                />

                                <span className="ml-10 language-name">{langue.langueLoc || "Langue"}</span>
                              </FButton>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                ) : null}
              </div>

              <ContenuDispositif
                dispositif={dispositif}
                showMapButton={(val: boolean) => {
                  setAddMapBtn(val);
                }}
                updateUIArray={updateUIArray}
                handleContentClick={handleContentClick}
                handleMenuChange={handleMenuChange}
                onEditorStateChange={onEditorStateChange}
                toggleModal={toggleModal}
                deleteCard={deleteCard}
                addItem={addItem}
                typeContenu={dispositif?.typeContenu || "dispositif"}
                uiArray={dispositif?.uiArray || []}
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
                toggleShareContentOnMobileModal={() => setShowShareContentOnMobileModal(!showShareContentOnMobileModal)}
                mainTheme={mainTheme}
                toggleTooltip={() => setTooltipOpen(!tooltipOpen)}
              />

              {disableEdit && (
                <>
                  {!printing && (
                    <FeedbackFooter
                      pushReaction={pushReaction}
                      didThank={didThank}
                      color={mainTheme.colors.color100}
                      nbThanks={dispositif?.merci ? dispositif?.merci.length : 0}
                    />
                  )}
                  {!printing && (
                    <div
                      className={cls(mobile.hidden, "discussion-footer bg-darkColor")}
                      style={{ backgroundColor: mainTheme.colors.color100 }}
                    >
                      <h5>{t("Dispositif.Avis", "Avis et discussions")}</h5>
                      <span>{t("Bientôt disponible !", "Bientôt disponible !")}</span>
                    </div>
                  )}
                  {[...(dispositif?.participants || []), dispositif?.creatorId || []].length > 0 && !printing && (
                    <div className={cls(mobile.hidden, "bottom-wrapper")}>
                      <ContribCaroussel
                        contributeurs={[...(dispositif?.participants || []), dispositif?.creatorId || []]}
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
                addMainSponsor={(sponsor: any) =>
                  dispatch(updateSelectedDispositifActionCreator({ mainSponsor: sponsor }))
                }
                deleteMainSponsor={deleteMainSponsor}
                editSponsor={editSponsor}
                admin={admin}
                validate={toggleDispositifValidateModalFinal}
                finalValidation={finalValidation}
                toggleFinalValidation={() => setFinalValidation(false)}
                toggleTutorielModal={toggleTutorielModal}
                displayTuto={displayTuto}
                updateUIArray={updateUIArray}
                typeContenu={dispositif?.typeContenu}
                toggleDispositifValidateModal={toggleDispositifValidateModal}
                mainTheme={mainTheme}
                locale={router.locale}
              />
            </Col>
            <Col
              xl="2"
              lg="2"
              md="2"
              sm="2"
              xs="2"
              className={cls(mobile.hidden, "aside-right pt-40", props.type === "translation" && "sideView")}
            />
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

          {dispositif?.typeContenu === "dispositif" && (
            <DispositifCreateModal
              show={showDispositifCreateModal}
              toggle={() => setShowDispositifCreateModal(!showDispositifCreateModal)}
              typeContenu={dispositif?.typeContenu}
              navigateToCommentContribuer={() => router.push(getPath("/comment-contribuer", router.locale))}
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
            saveDispositif={saveDispositif}
            status={dispositif?.status}
            toggleTutorielModal={toggleTutorielModal}
            theme={dispositif?.theme}
            mainSponsor={dispositif?.mainSponsor}
            menu={menu}
            toggleThemesModal={() => setShowTagsModal(!showTagsModal)}
            toggleSponsorModal={() =>
              //@ts-ignore
              sponsorsRef.current.toggleModal("responsabilite")
            }
            toggleGeolocModal={(val: boolean) => setShowGeolocModal(val)}
            addItem={addItem}
          />
          <TagsModal
            theme={dispositif?.theme}
            secondaryThemes={dispositif?.secondaryThemes || []}
            validate={validateThemes}
            allThemes={themes}
            show={showTagsModal}
            toggle={() => setShowTagsModal(!showTagsModal)}
            toggleTutorielModal={toggleTutorielModal}
            user={user}
            dispositifId={dispositif?._id?.toString() || ""}
          />
          <FrameModal show={showTutorielModal} toggle={toggleTutorielModal} section={tutorielSection} />
          <LanguageToReadModal
            show={showLanguageToReadModal}
            toggle={() => setShowLanguageToReadModal(!showLanguageToReadModal)}
            languages={possibleLanguages}
            changeLanguage={changeLanguage}
          />

          <DraftModal
            show={showDraftModal}
            toggle={() => setShowDraftModal(!showDraftModal)}
            saveDispositif={saveDispositif}
            status={dispositif?.status || ""}
            toggleIsModified={(val: boolean) => setIsModified(val)}
            toggleIsSaved={(val: boolean) => setIsSaved(val)}
          />
          <ShareContentOnMobileModal
            show={showShareContentOnMobileModal}
            toggle={() => setShowShareContentOnMobileModal(!showShareContentOnMobileModal)}
            typeContenu={dispositif?.typeContenu || "dispositif"}
            content={getContent(dispositif)}
            t={t}
          />

          {isInBrowser() && NotificationContainer !== null && <NotificationContainer />}
        </Col>
      </Row>
    </div>
  );
};

export default Dispositif;
