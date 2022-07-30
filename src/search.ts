import type * as Types from "./types";
import { cleanQuery, formatImage, IMDB_MEDIA_URL, request, urlReplacer } from "./utils";

export default class IMDbSearch {
	private searchUrl = IMDB_MEDIA_URL;

	private searchSuggestionUrl = this.searchUrl + "/suggestion";

	private searchMultiUrl = this.searchSuggestionUrl + "/{q}/{query}.json";
	private searchTitleUrl = this.searchSuggestionUrl + "/titles/{q}/{query}.json";
	private searchNameUrl = this.searchSuggestionUrl + "/names/{q}/{query}.json";

	private searchExclude: Types.Qid[] = [];
	private includeVideos: 0 | 1 = 0;

	public constructor(options?: {
		searchUrl?: string;
		searchExclude?: Types.Qid[];
		includeVideos?: boolean;
	}) {
		if (options === undefined) return;

		if (options.searchUrl !== undefined) {
			this.searchUrl = options.searchUrl;
		}

		if (options.searchExclude !== undefined) {
			this.searchExclude = options.searchExclude;
		}

		if (options.includeVideos) {
			this.includeVideos = 1;
		}
	}
}
