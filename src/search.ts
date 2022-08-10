import { http, string } from "@ghostebony/utils";
import type * as Types from "./types";
import { cleanQuery, formatImage, IMDB_MEDIA_URL } from "./utils";

export default class IMDbSearch {
	private baseUrl = IMDB_MEDIA_URL;

	private searchSuggestionUrl = this.baseUrl + "/suggestion";

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
			this.baseUrl = options.searchUrl;
		}

		if (options.searchExclude !== undefined) {
			this.searchExclude = options.searchExclude;
		}

		if (options.includeVideos) {
			this.includeVideos = 1;
		}
	}

	public multi = async (query: string) => {
		const cq = cleanQuery(query);

		const { data } = await http.get<Types.SearchContainer>(
			string.replacer(this.searchMultiUrl, { q: cq[0], query: cq }),
			{ params: { includeVideos: this.includeVideos } }
		);
		if (!data) return [];

		const items = [];

		if ("d" in data) {
			for (const item of data.d) {
				if (!!item.qid) {
					if (!this.searchExclude.includes(item.qid)) {
						items.push(this.titleModel(item));
					}
				} else {
					items.push(this.nameModel(item));
				}
			}
		}
		return items;
	};

	public title = async (query: string) => {
		const cq = cleanQuery(query);

		const { data } = await http.get<Types.SearchContainer>(
			string.replacer(this.searchTitleUrl, { q: cq[0], query: cq }),
			{ params: { includeVideos: this.includeVideos } }
		);
		if (!data) return [];

		const titles = [];

		if ("d" in data) {
			for (const title of data.d) {
				if (!!title.qid && !this.searchExclude.includes(title.qid)) {
					titles.push(this.titleModel(title));
				}
			}
		}
		return titles;
	};

	public name = async (query: string) => {
		const cq = cleanQuery(query);

		const { data } = await http.get<Types.SearchContainer>(
			string.replacer(this.searchNameUrl, { q: cq[0], query: cq }),
			{ params: { includeVideos: this.includeVideos } }
		);
		if (!data) return [];

		const names = [];

		if ("d" in data) {
			for (const name of data.d) {
				names.push(this.nameModel(name));
			}
		}
		return names;
	};

	private titleModel = (title: Types.Search) => ({
		id: title.id,
		title: title.l,
		type: title.qid,
		year: title.y,
		date: title.yr,
		poster: formatImage(title.i?.imageUrl),
		stars: title.s,
		rank: title.rank,
	});

	private nameModel = (name: Types.Search) => ({
		id: name.id,
		name: name.l,
		photo: formatImage(name.i?.imageUrl),
		star: name.s,
		rank: name.rank,
	});
}
