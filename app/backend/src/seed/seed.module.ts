import { Module } from "@nestjs/common";
import { BlogEntryModule } from "../blog-entry/blog-entry.module.js";

@Module({
    imports: [BlogEntryModule],
})
export class SeedModule {}
