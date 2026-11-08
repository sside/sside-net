import { applyDecorators, UseGuards } from "@nestjs/common";
import { SignedInGuard } from "../signed-in.guard.js";

export const SignedIn = () => applyDecorators(UseGuards(SignedInGuard));
