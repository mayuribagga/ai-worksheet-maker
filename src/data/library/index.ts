import type { Course } from "./build";
import { coreFrench } from "./core-french";
import { frenchImmersion } from "./french-immersion";
import { geography } from "./geography";
import { history } from "./history";
import { math } from "./math";
import { socialStudies } from "./social-studies";

export type { Course, Strand, Topic } from "./build";

// Every grade and subject in the resource library.
export const libraryCourses: Course[] = [
  ...math,
  ...coreFrench,
  ...frenchImmersion,
  ...socialStudies,
  ...history,
  ...geography,
];
