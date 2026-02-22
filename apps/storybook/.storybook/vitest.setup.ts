import { beforeAll } from "vitest";
import { setProjectAnnotations } from "@storybook/react-vite";
import * as preview from "./preview";

const projectAnnotations = setProjectAnnotations(preview);

beforeAll(projectAnnotations.beforeAll);
