import type { SimpleDispositif } from "@refugies-info/api-types";
import { getNextUpcomingSession } from "~/lib/learnFrench/courseSessions";

const dispositifWithSessions = (startDates: string[]): SimpleDispositif =>
  ({
    metadatas: {
      sessions: {
        items: startDates.map((startDate) => ({ startDate })),
      },
    },
  }) as unknown as SimpleDispositif;

describe("getNextUpcomingSession", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2026-10-01T18:00:00"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("includes a session starting earlier today", () => {
    const dispositif = dispositifWithSessions(["2026-10-01T09:00:00"]);
    expect(getNextUpcomingSession(dispositif)?.startDate).toEqual("2026-10-01T09:00:00");
  });

  it("excludes a session that started yesterday", () => {
    const dispositif = dispositifWithSessions(["2026-09-30T09:00:00"]);
    expect(getNextUpcomingSession(dispositif)).toBeUndefined();
  });

  it("picks the earliest session among today and future ones", () => {
    const dispositif = dispositifWithSessions([
      "2026-10-15T09:00:00",
      "2026-10-01T09:00:00",
      "2026-09-30T09:00:00",
    ]);
    expect(getNextUpcomingSession(dispositif)?.startDate).toEqual("2026-10-01T09:00:00");
  });
});
