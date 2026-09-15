import { useTranslation } from "next-i18next";
import { TabItem, TabsBar } from "~/components/UI/Tabs";

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
    { key: CourseTab.UPCOMING, iconId: "fr-icon-time-line", labelKey: "LearnFrench.tab_upcoming" },
    {
      key: CourseTab.ON_DEMAND,
      iconId: "fr-icon-calendar-event-line",
      labelKey: "LearnFrench.tab_onDemand",
    },
    { key: CourseTab.ALL, iconId: "fr-icon-list-unordered", labelKey: "LearnFrench.tab_all" },
  ];

  return (
    <TabsBar>
      {tabs.map((tab) => (
        <TabItem
          key={tab.key}
          isActive={props.activeTab === tab.key}
          onClick={() => props.onChange(tab.key)}
        >
          <i className={tab.iconId} aria-hidden="true" /> {t(tab.labelKey, "")}
        </TabItem>
      ))}
    </TabsBar>
  );
};
