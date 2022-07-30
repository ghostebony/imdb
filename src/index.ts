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

	public title = {
		rate: async (id: Types.TitleId, rating: Types.RatingRange) =>
			this.request<{
				data: {
					rateTitle: {
						rating: { value: Types.RatingRange; __typename: "Rating" };
						__typename: "RatingOutput";
					};
				};
				extensions: {
					disclaimer: string;
				};
			}>(this.imdbGraphqlUrl, {
				method: "POST",
				body: {
					query: `
						mutation UpdateTitleRating($rating: Int!, $titleId: ID!) {
							rateTitle(input: {rating: $rating, titleId: $titleId}) {
								rating {
									value __typename
								}
								__typename
							}
						}
					`,
					operationName: "UpdateTitleRating",
					variables: { rating, titleId: id },
				},
				headers: { "content-type": "application/json" },
			}),
		unrate: async (id: Types.TitleId) =>
			this.request<{
				data: {
					deleteTitleRating: {
						date: string;
						__typename: "DeleteTitleRatingOutput";
					};
				};
				extensions: {
					disclaimer: string;
				};
			}>(this.imdbGraphqlUrl, {
				method: "POST",
				body: {
					query: `
						mutation DeleteTitleRating($titleId: ID!) {
							deleteTitleRating(input: {titleId: $titleId}) {
								date __typename
							}
						}
					`,
					operationName: "DeleteTitleRating",
					variables: { titleId: id },
				},
				headers: { "content-type": "application/json" },
			}),
	};

	public watchlist = {
		add: async (id: Types.TitleId) =>
			this.request<{ list_id: Types.ListId; list_item_id: `${number}`; status: number }>(
				urlReplacer(this.watchlistUrl, { id }),
				{
					method: "PUT",
				}
			),
		remove: async (id: Types.TitleId) =>
			this.request<{ list_id: Types.ListId; status: number }>(
				urlReplacer(this.watchlistUrl, { id }),
				{
					method: "DELETE",
				}
			),
	};

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
