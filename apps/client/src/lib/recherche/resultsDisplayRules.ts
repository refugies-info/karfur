import { GetDispositifsResponse, GetThemeResponse } from "@refugies-info/api-types";
import _ from "lodash";
import { SortOptions, TypeOptions } from "~/data/searchFilters";
import {
  noSort,
  sortByDate,
  sortByLocation,
  sortByTheme,
  sortByView,
  sortByViewFirstLocalThenFrance,
} from "~/lib/recherche/sortContents";

export type FilterKey = "age" | "frenchLevel" | "keywords" | "location" | "public" | "status" | "theme";
export type RuleKey = SortOptions | "suggestions";
export type TabKey = TypeOptions;

type DisplayRule = {
  filters: Array<FilterKey>;
  rules: Record<
    Exclude<RuleKey, "suggestions">,
    | {
        display: true;
        sortFunction: (
          dispA: GetDispositifsResponse,
          dispB: GetDispositifsResponse,
          themes: GetThemeResponse[],
        ) => number;
      }
    | {
        display: false;
        sortFunction?: undefined;
      }
  > &
    Record<"suggestions", { display: boolean; sortFunction?: undefined }>;
};

const DISPLAY_RULES: Record<TabKey, DisplayRule[]> = {
  all: [
    {
      filters: [],
      rules: {
        default: {
          display: true,
          sortFunction: sortByView,
        },
        view: {
          display: true,
          sortFunction: sortByView,
        },
        date: {
          display: true,
          sortFunction: sortByDate,
        },
        location: {
          display: false,
        },
        theme: {
          display: true,
          sortFunction: sortByTheme,
        },
        suggestions: {
          display: false,
        },
      },
    },
    {
      filters: ["location"],
      rules: {
        default: {
          display: true,
          sortFunction: sortByLocation,
        },
        view: {
          display: true,
          sortFunction: sortByView,
        },
        date: {
          display: true,
          sortFunction: sortByDate,
        },
        location: {
          display: true,
          sortFunction: sortByViewFirstLocalThenFrance,
        },
        theme: {
          display: true,
          sortFunction: sortByTheme,
        },
        suggestions: {
          display: false,
        },
      },
    },
    {
      filters: ["keywords"],
      rules: {
        default: {
          display: true,
          sortFunction: noSort,
        },
        view: {
          display: false,
        },
        date: {
          display: false,
        },
        location: {
          display: false,
        },
        theme: {
          display: false,
        },
        suggestions: {
          display: false,
        },
      },
    },
    {
      filters: ["theme"],
      rules: {
        default: {
          display: true,
          sortFunction: sortByView,
        },
        view: {
          display: true,
          sortFunction: sortByView,
        },
        date: {
          display: true,
          sortFunction: sortByDate,
        },
        location: {
          display: false,
        },
        theme: {
          display: false,
        },
        suggestions: {
          display: true,
        },
      },
    },
    {
      filters: ["location", "keywords"],
      rules: {
        default: {
          display: true,
          sortFunction: noSort,
        },
        view: {
          display: false,
        },
        date: {
          display: false,
        },
        location: {
          display: false,
        },
        theme: {
          display: false,
        },
        suggestions: {
          display: false,
        },
      },
    },
    {
      filters: ["theme", "keywords"],
      rules: {
        default: {
          display: true,
          sortFunction: noSort,
        },
        view: {
          display: false,
        },
        date: {
          display: false,
        },
        location: {
          display: false,
        },
        theme: {
          display: false,
        },
        suggestions: {
          display: false,
        },
      },
    },
    {
      filters: ["theme", "location"],
      rules: {
        default: {
          display: true,
          sortFunction: sortByLocation,
        },
        view: {
          display: true,
          sortFunction: sortByView,
        },
        date: {
          display: true,
          sortFunction: sortByDate,
        },
        location: {
          display: true,
          sortFunction: sortByViewFirstLocalThenFrance,
        },
        theme: {
          display: false,
        },
        suggestions: {
          display: true,
        },
      },
    },
    {
      filters: ["theme", "location", "keywords"],
      rules: {
        default: {
          display: true,
          sortFunction: noSort,
        },
        view: {
          display: false,
        },
        date: {
          display: false,
        },
        location: {
          display: false,
        },
        theme: {
          display: false,
        },
        suggestions: {
          display: false,
        },
      },
    },
  ],
  dispositif: [
    {
      filters: [],
      rules: {
        default: {
          display: true,
          sortFunction: sortByView,
        },
        view: {
          display: true,
          sortFunction: sortByView,
        },
        date: {
          display: true,
          sortFunction: sortByDate,
        },
        location: {
          display: false,
        },
        theme: {
          display: true,
          sortFunction: sortByTheme,
        },
        suggestions: {
          display: false,
        },
      },
    },
    {
      filters: ["location"],
      rules: {
        default: {
          display: true,
          sortFunction: sortByLocation,
        },
        view: {
          display: true,
          sortFunction: sortByView,
        },
        date: {
          display: true,
          sortFunction: sortByDate,
        },
        location: {
          display: true,
          sortFunction: sortByViewFirstLocalThenFrance,
        },
        theme: {
          display: true,
          sortFunction: sortByTheme,
        },
        suggestions: {
          display: false,
        },
      },
    },
    {
      filters: ["keywords"],
      rules: {
        default: {
          display: true,
          sortFunction: noSort,
        },
        view: {
          display: false,
        },
        date: {
          display: false,
        },
        location: {
          display: false,
        },
        theme: {
          display: false,
        },
        suggestions: {
          display: false,
        },
      },
    },
    {
      filters: ["theme"],
      rules: {
        default: {
          display: true,
          sortFunction: sortByView,
        },
        view: {
          display: true,
          sortFunction: sortByView,
        },
        date: {
          display: true,
          sortFunction: sortByDate,
        },
        location: {
          display: true,
          sortFunction: sortByViewFirstLocalThenFrance,
        },
        theme: {
          display: false,
        },
        suggestions: {
          display: true,
        },
      },
    },
    {
      filters: ["location", "keywords"],
      rules: {
        default: {
          display: true,
          sortFunction: noSort,
        },
        view: {
          display: false,
        },
        date: {
          display: false,
        },
        location: {
          display: false,
        },
        theme: {
          display: false,
        },
        suggestions: {
          display: false,
        },
      },
    },
    {
      filters: ["theme", "keywords"],
      rules: {
        default: {
          display: true,
          sortFunction: noSort,
        },
        view: {
          display: false,
        },
        date: {
          display: false,
        },
        location: {
          display: false,
        },
        theme: {
          display: false,
        },
        suggestions: {
          display: false,
        },
      },
    },
    {
      filters: ["theme", "location"],
      rules: {
        default: {
          display: true,
          sortFunction: sortByLocation,
        },
        view: {
          display: true,
          sortFunction: sortByView,
        },
        date: {
          display: true,
          sortFunction: sortByDate,
        },
        location: {
          display: true,
          sortFunction: sortByViewFirstLocalThenFrance,
        },
        theme: {
          display: false,
        },
        suggestions: {
          display: true,
        },
      },
    },
    {
      filters: ["theme", "location", "keywords"],
      rules: {
        default: {
          display: true,
          sortFunction: noSort,
        },
        view: {
          display: false,
        },
        date: {
          display: false,
        },
        location: {
          display: false,
        },
        theme: {
          display: false,
        },
        suggestions: {
          display: false,
        },
      },
    },
  ],
  demarche: [
    {
      filters: [],
      rules: {
        default: {
          display: true,
          sortFunction: sortByView,
        },
        view: {
          display: true,
          sortFunction: sortByView,
        },
        date: {
          display: true,
          sortFunction: sortByDate,
        },
        location: {
          display: false,
        },
        theme: {
          display: true,
          sortFunction: sortByTheme,
        },
        suggestions: {
          display: false,
        },
      },
    },
    {
      filters: ["location"],
      rules: {
        default: {
          display: true,
          sortFunction: sortByView,
        },
        view: {
          display: true,
          sortFunction: sortByView,
        },
        date: {
          display: true,
          sortFunction: sortByDate,
        },
        location: {
          display: false,
        },
        theme: {
          display: true,
          sortFunction: sortByTheme,
        },
        suggestions: {
          display: false,
        },
      },
    },
    {
      filters: ["keywords"],
      rules: {
        default: {
          display: true,
          sortFunction: noSort,
        },
        view: {
          display: false,
        },
        date: {
          display: false,
        },
        location: {
          display: false,
        },
        theme: {
          display: false,
        },
        suggestions: {
          display: false,
        },
      },
    },
    {
      filters: ["theme"],
      rules: {
        default: {
          display: true,
          sortFunction: sortByView,
        },
        view: {
          display: true,
          sortFunction: sortByView,
        },
        date: {
          display: true,
          sortFunction: sortByDate,
        },
        location: {
          display: false,
        },
        theme: {
          display: false,
        },
        suggestions: {
          display: true,
        },
      },
    },
    {
      filters: ["location", "keywords"],
      rules: {
        default: {
          display: true,
          sortFunction: noSort,
        },
        view: {
          display: false,
        },
        date: {
          display: false,
        },
        location: {
          display: false,
        },
        theme: {
          display: false,
        },
        suggestions: {
          display: false,
        },
      },
    },
    {
      filters: ["theme", "keywords"],
      rules: {
        default: {
          display: true,
          sortFunction: noSort,
        },
        view: {
          display: false,
        },
        date: {
          display: false,
        },
        location: {
          display: false,
        },
        theme: {
          display: false,
        },
        suggestions: {
          display: false,
        },
      },
    },
    {
      filters: ["theme", "location"],
      rules: {
        default: {
          display: true,
          sortFunction: sortByView,
        },
        view: {
          display: true,
          sortFunction: sortByView,
        },
        date: {
          display: true,
          sortFunction: sortByDate,
        },
        location: {
          display: false,
        },
        theme: {
          display: false,
        },
        suggestions: {
          display: true,
        },
      },
    },
    {
      filters: ["theme", "location", "keywords"],
      rules: {
        default: {
          display: true,
          sortFunction: noSort,
        },
        view: {
          display: false,
        },
        date: {
          display: false,
        },
        location: {
          display: false,
        },
        theme: {
          display: false,
        },
        suggestions: {
          display: false,
        },
      },
    },
  ],
  ressource: [
    {
      filters: [],
      rules: {
        default: {
          display: true,
          sortFunction: sortByView,
        },
        view: {
          display: true,
          sortFunction: sortByView,
        },
        date: {
          display: true,
          sortFunction: sortByDate,
        },
        location: {
          display: false,
        },
        theme: {
          display: true,
          sortFunction: sortByTheme,
        },
        suggestions: {
          display: false,
        },
      },
    },
    {
      filters: ["location"],
      rules: {
        default: {
          display: true,
          sortFunction: sortByView,
        },
        view: {
          display: true,
          sortFunction: sortByView,
        },
        date: {
          display: true,
          sortFunction: sortByDate,
        },
        location: {
          display: false,
        },
        theme: {
          display: true,
          sortFunction: sortByTheme,
        },
        suggestions: {
          display: false,
        },
      },
    },
    {
      filters: ["keywords"],
      rules: {
        default: {
          display: true,
          sortFunction: noSort,
        },
        view: {
          display: false,
        },
        date: {
          display: false,
        },
        location: {
          display: false,
        },
        theme: {
          display: false,
        },
        suggestions: {
          display: false,
        },
      },
    },
    {
      filters: ["theme"],
      rules: {
        default: {
          display: true,
          sortFunction: sortByView,
        },
        view: {
          display: true,
          sortFunction: sortByView,
        },
        date: {
          display: true,
          sortFunction: sortByDate,
        },
        location: {
          display: false,
        },
        theme: {
          display: false,
        },
        suggestions: {
          display: true,
        },
      },
    },
    {
      filters: ["location", "keywords"],
      rules: {
        default: {
          display: true,
          sortFunction: noSort,
        },
        view: {
          display: false,
        },
        date: {
          display: false,
        },
        location: {
          display: false,
        },
        theme: {
          display: false,
        },
        suggestions: {
          display: false,
        },
      },
    },
    {
      filters: ["theme", "keywords"],
      rules: {
        default: {
          display: true,
          sortFunction: noSort,
        },
        view: {
          display: false,
        },
        date: {
          display: false,
        },
        location: {
          display: false,
        },
        theme: {
          display: false,
        },
        suggestions: {
          display: false,
        },
      },
    },
    {
      filters: ["theme", "location"],
      rules: {
        default: {
          display: true,
          sortFunction: sortByLocation,
        },
        view: {
          display: true,
          sortFunction: sortByView,
        },
        date: {
          display: true,
          sortFunction: sortByDate,
        },
        location: {
          display: false,
        },
        theme: {
          display: false,
        },
        suggestions: {
          display: true,
        },
      },
    },
    {
      filters: ["theme", "location", "keywords"],
      rules: {
        default: {
          display: false,
        },
        view: {
          display: false,
        },
        date: {
          display: false,
        },
        location: {
          display: false,
        },
        theme: {
          display: false,
        },
        suggestions: {
          display: false,
        },
      },
    },
  ],
};

export const getDisplayRule = (tab: TabKey, filters: Array<FilterKey>, key: RuleKey) => {
  // Check if the typeFilter exists in displayRules
  if (!DISPLAY_RULES[tab]) {
    return undefined;
  }

  // Iterate through the array of DisplayRule objects for the given typeFilter
  for (const rule of DISPLAY_RULES[tab]) {
    // Check if the filters array matches the provided filters
    if (_.isEqual(rule.filters, filters)) {
      return rule.rules[key];
    }
  }

  return undefined;
};

export const getDefaultSortOption = (tab: TabKey, filters: Array<FilterKey>): SortOptions => {
  const rule = getDisplayRule(tab, filters, "default");
  switch (rule?.sortFunction) {
    case sortByDate:
      return "date";
    case sortByLocation:
      return "location";
    case sortByTheme:
      return "theme";
    default:
      return "view";
  }
};
