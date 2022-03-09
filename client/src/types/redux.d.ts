import "redux";
import { Task } from "redux-saga";

declare module "redux" {
  export interface Store {
    sagaTask?: Task;
  }
}
