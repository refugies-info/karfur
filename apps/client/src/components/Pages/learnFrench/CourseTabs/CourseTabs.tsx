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
      iconId: "ri-calendar-2-line",
      labelKey: "LearnFrench.tab_upcoming",
    },
    {
      key: CourseTab.ON_DEMAND,
      iconId: "fr-icon-calendar-event-line",
      labelKey: "LearnFrench.tab_onDemand",
    },
    { key: CourseTab.ALL, iconId: "ri-list-unordered", labelKey: "LearnFrench.tab_all" },
  ];

  return (
    <div className="border-default-grey flex w-full overflow-hidden rounded border bg-white lg:inline-flex lg:w-auto">
      {tabs.map((tab) => {
        const isActive = props.activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => props.onChange(tab.key)}
            className={cls(
              "flex min-h-16 flex-1 flex-col items-center justify-center gap-1 px-2 py-2 text-center text-sm lg:text-h5 lg:inline-flex lg:min-h-0 lg:flex-none lg:flex-row lg:gap-2 lg:px-4 lg:py-3",
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
