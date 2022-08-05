import type * as Types from "./types";
import { IMDB_GRAPHQL_URL, IMDB_URL, request, urlReplacer } from "./utils";

export default class IMDbAccount {
	private authCookie: string;

	private baseUrl = IMDB_URL;
	private baseGraphqlUrl = IMDB_GRAPHQL_URL;

	private watchlistUrl = this.baseUrl + "/watchlist/{id}";

	public constructor(
		auth: { "at-main": string; "ubid-main": string },
		options?: {
			baseUrl?: string;
			baseGraphqlUrl?: string;
		}
	) {
		this.authCookie = `at-main=${auth["at-main"]}; ubid-main=${auth["ubid-main"]};`;

		if (options === undefined) return;

		if (options.baseUrl !== undefined) {
			this.baseUrl = options.baseUrl;
		}

		if (options.baseGraphqlUrl !== undefined) {
			this.baseGraphqlUrl = options.baseGraphqlUrl;
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
			}>(this.baseGraphqlUrl, {
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
			}>(this.baseGraphqlUrl, {
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

	public list = {
		add: async (id: Types.TitleId, listId: Types.ListId) =>
			this.request<{
				data: {
					addItemToList: { listId: Types.ListId; __typename: "ModifiedListOutput" };
				};
				extensions: {
					disclaimer: string;
				};
			}>(this.baseGraphqlUrl, {
				method: "POST",
				body: {
					query: `
					mutation AddConstToList($listId: ID!, $constId: ID!) {
						addItemToList(input: {listId: $listId, item: {itemElementId: $constId}}) {
							listId __typename
						}
					}`,
					operationName: "AddConstToList",
					variables: { listId, constId: id },
				},
				headers: { "content-type": "application/json" },
			}),
		remove: async (id: Types.TitleId, listId: Types.ListId) =>
			this.request<{
				data: {
					removeElementFromList: {
						listId: Types.ListId;
						__typename: "ModifiedListOutput";
					} | null;
				};
				extensions: {
					disclaimer: string;
				};
			}>(this.baseGraphqlUrl, {
				method: "POST",
				body: {
					query: `
					mutation RemoveConstFromList($listId: ID!, $constId: ID!) {
						removeElementFromList(input: {listId: $listId, itemElementId: $constId}) {
							listId __typename
						}
					}`,
					operationName: "RemoveConstFromList",
					variables: { listId, constId: id },
				},
				headers: { "content-type": "application/json" },
			}),
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
