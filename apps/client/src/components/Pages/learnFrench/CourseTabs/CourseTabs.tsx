import { useTranslation } from "next-i18next";
import { cls } from "~/lib/classname";

export const CourseTab = {
  UPCOMING: "upcoming",
  ON_DEMAND: "onDemand",
  ALL: "all",
} as const;

export type CourseTab = (typeof CourseTab)[keyof typeof CourseTab];

interface Props {
  activeTab: CourseTab;
  onChange: (tab: CourseTab) => void;
}

export const CourseTabs = (props: Props) => {
  const { t } = useTranslation();

  const tabs: { key: CourseTab; iconId: string; labelKey: string }[] = [
    {
      key: CourseTab.UPCOMING,
      iconId: "fr-icon-calendar-2-line",
      labelKey: "LearnFrench.tab_upcoming",
    },
    {
      key: CourseTab.ON_DEMAND,
      iconId: "fr-icon-calendar-event-line",
      labelKey: "LearnFrench.tab_onDemand",
    },
    { key: CourseTab.ALL, iconId: "fr-icon-list-unordered", labelKey: "LearnFrench.tab_all" },
  ];

  return (
    <div className="border-default-grey inline-flex overflow-hidden rounded border bg-white">
      {tabs.map((tab) => {
        const isActive = props.activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => props.onChange(tab.key)}
            className={cls(
              "text-h5 inline-flex items-center gap-2 px-4 py-3",
              isActive
                ? "bg-action-high-blue-france font-bold text-white"
                : "text-default-grey font-normal",
            )}
          >
            <i className={tab.iconId} aria-hidden="true" />
            {t(tab.labelKey, tab.labelKey)}
          </button>
        );
      })}
    </div>
  );
};
