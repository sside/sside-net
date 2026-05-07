import { applyDecorators, UseGuards } from "@nestjs/common";
import { SignedInGuard } from "../signed-in.guard";

export const SignedIn = () => applyDecorators(UseGuards(SignedInGuard));
