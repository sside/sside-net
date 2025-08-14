import { ReactNode } from "react";

export type ChildrenProp = Readonly<{ children: ReactNode }>;
export type OptionalChildrenProp = Partial<ChildrenProp>;
