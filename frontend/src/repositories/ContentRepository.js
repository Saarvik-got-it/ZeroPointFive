import { StaticContentRepository } from "./StaticContentRepository";
import { ApiContentRepository } from "./ApiContentRepository";

const dataSource = import.meta.env.VITE_DATA_SOURCE || "static";

console.log(`[ContentRepository] Active Data Source Mode: ${dataSource.toUpperCase()}`);

export const ContentRepository = dataSource === "api" ? ApiContentRepository : StaticContentRepository;
export default ContentRepository;
