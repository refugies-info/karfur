import { useTranslation } from "next-i18next";
import { type FormEvent, useState } from "react";
import { MobileShareButton } from "~/components/Pages/learnFrench/CourseResults/MobileShareButton";

export interface ActiveFilterBadge {
  key: string;
  label: string;
  onRemove: () => void;
}

interface Props {
  total: number;
  filterGroupCount: number;
  badges: ActiveFilterBadge[];
  search: string;
  onSearchSubmit: (search: string) => void;
  onOpenFilters: () => void;
}

const SEARCH_FORM_ID = "learn-french-mobile-search";

const TOOLBAR_BUTTON_CLASSNAME =
  "border-default-grey text-title-blue-france flex h-11 items-center justify-center rounded border bg-white";

export const MobileToolbar = (props: Props) => {
  const { t } = useTranslation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [draft, setDraft] = useState(props.search);
  const searchLabel = t("LearnFrench.search_placeholder", "Rechercher par mot-clé");

  const toggleSearch = () => {
    setDraft(props.search);
    setIsSearchOpen((isOpen) => !isOpen);
  };

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.onSearchSubmit(draft.trim());
    setIsSearchOpen(false);
  };

  return (
    <div className="flex flex-col gap-3 lg:hidden">
      <div className="flex items-center justify-between gap-2">
        <p className="mb-0 text-sm" aria-live="polite">
          {t("LearnFrench.results_count", { count: props.total })}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSearch}
            title={searchLabel}
            aria-label={searchLabel}
            aria-expanded={isSearchOpen}
            aria-controls={SEARCH_FORM_ID}
            className={`${TOOLBAR_BUTTON_CLASSNAME} w-11`}
          >
            <i className="fr-icon-search-line fr-icon--sm" aria-hidden="true" />
          </button>
          <MobileShareButton />
          <button
            type="button"
            onClick={props.onOpenFilters}
            className={`${TOOLBAR_BUTTON_CLASSNAME} gap-2 px-3 text-sm font-medium`}
          >
            <i className="fr-icon-equalizer-line fr-icon--sm" aria-hidden="true" />
            {t("LearnFrench.filters_title", "Filtrer")}
            {props.filterGroupCount > 0 && (
              <span className="bg-action-high-blue-france flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs text-white">
                {props.filterGroupCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {props.badges.length > 0 && (
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {props.badges.map((badge) => (
            <li key={badge.key} className="p-0">
              <button
                type="button"
                onClick={badge.onRemove}
                aria-label={t("LearnFrench.filter_remove", "Retirer le filtre {{label}}", {
                  label: badge.label,
                })}
                className="bg-action-high-blue-france inline-flex min-h-8 items-center gap-2 rounded-full px-3 py-1 text-sm font-medium text-white"
              >
                {badge.label}
                <i className="fr-icon-close-line fr-icon--sm" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {isSearchOpen && (
        <form id={SEARCH_FORM_ID} role="search" onSubmit={submitSearch}>
          <div className="fr-search-bar">
            <input
              className="fr-input"
              type="search"
              enterKeyHint="search"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              autoFocus
              placeholder={searchLabel}
              aria-label={searchLabel}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
            <button
              className="fr-btn"
              type="submit"
              title={t("LearnFrench.search_submit", "Rechercher")}
            >
              {t("LearnFrench.search_submit", "Rechercher")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
