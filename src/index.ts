import { IMDB_GRAPHQL_URL, IMDB_URL, request, urlReplacer } from "./utils";

export default class IMDb {
	private authCookie: string;

	private imdbUrl = IMDB_URL;
	private imdbGraphqlUrl = IMDB_GRAPHQL_URL;

	private watchlistUrl = this.imdbUrl + "/watchlist/{id}";

	public constructor(
		auth: { "at-main": string; "ubid-main": string },
		options?: {
			imdbUrl?: string;
			imdbGraphqlUrl?: string;
		}
	) {
		this.authCookie = `at-main=${auth["at-main"]}; ubid-main=${auth["ubid-main"]};`;

		if (options === undefined) return;

		if (options.imdbUrl !== undefined) {
			this.imdbUrl = options.imdbUrl;
		}

		if (options.imdbGraphqlUrl !== undefined) {
			this.imdbGraphqlUrl = options.imdbGraphqlUrl;
		}
	}

	private request = <dataType>(
		endpoint: string,
		init: {
			method?: "GET" | "POST" | "PUT" | "DELETE";
			headers?: HeadersInit;
			body?: { [key: string]: any } | FormData | string;
		} = { method: "GET" }
	) =>
		request<dataType>(endpoint, {
			method: init.method,
			headers: {
				accept: "application/json",
				cookie: this.authCookie,
				...init.headers,
			},
			body: init.body,
		});
}
