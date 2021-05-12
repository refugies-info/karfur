// // @ts-nocheck
// import {
//   sendSubscriptionReminderMailService,
// } from "../../../modules/mail/mail.service";
// import moment from "moment";
// import mockdate from "mockdate";
// import logger from "../../../logger";

// mockdate.set("2019-11-10T10:00:00.00Z");

// jest.mock("../../../logger");
// jest.mock("../../../libs/checkAuthorizations", () => ({
//   checkCronAuthorization: jest.fn(),
// }));

// jest.mock("../../../modules/dispositif/dispositif.repository", () => ({
//   getDraftDispositifs: jest.fn(),
//   updateDispositifInDB: jest.fn(),
// }));

// jest.mock("../../../modules/mail/mail.service", () => ({
//   sendOneDraftReminderMailService: jest.fn(),
//   sendMultipleDraftsReminderMailService: jest.fn(),
// }));

// type MockResponse = { json: any; status: any };
// const mockResponse = (): MockResponse => {
//   const res: MockResponse = {};
//   res.status = jest.fn().mockReturnValue(res);
//   res.json = jest.fn().mockReturnValue(res);
//   return res;
// };

// describe("sendSubscriptionReminderMailService", () => {

// });
