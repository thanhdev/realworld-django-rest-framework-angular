import { FormControl } from "@angular/forms";
import { UpdateUserPayload } from "../api/user.model";

export type UserProfileFormViewModel = {
  [key in keyof UpdateUserPayload["user"]]: FormControl<string>;
};
