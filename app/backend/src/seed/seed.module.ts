import { Module } from "@nestjs/common";
import { BlogEntryModule } from "../blog-entry/blog-entry.module";

@Module({
    imports: [BlogEntryModule],
})
export class SeedModule {}
