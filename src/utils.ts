export const IMDB_URL = "https://www.imdb.com";

export const IMDB_GRAPHQL_URL = "https://api.graphql.imdb.com";

export const request = async <dataType, errorType = any>(
	endpoint: string,
	init: {
		method?: "GET" | "POST" | "PUT" | "DELETE";
		headers?: HeadersInit;
		body?: { [key: string]: any } | FormData | string;
		params?: { [key: string]: string | number };
	} = { method: "GET" }
) => {
	if (init.params) {
		const params = new URLSearchParams(
			filterObject(init.params, undefined) as Record<string, string>
		).toString();

		if (!!params) {
			endpoint = `${endpoint}?${params}`;
		}
	}

	const response = await fetch(endpoint, {
		method: init.method,
		headers: {
			accept: "application/json",
			...init.headers,
		},
		body: typeof init.body === "object" ? JSON.stringify(init.body) : init.body,
	});
	const contentType = response.headers.get("content-type");

	const responseBody = await (contentType === "application/json"
		? response.json()
		: response.text());

	let data: dataType | undefined;
	let error: errorType | undefined;

	if (response.ok) {
		data = responseBody as dataType;
	} else {
		error = responseBody as errorType;
	}

	return {
		data,
		error,
		ok: response.ok,
	};
};

export const urlReplacer = (url: string, data: { [key: string]: string }) =>
	url.replace(/\{([a-z]+)\}/g, (_, $2) => data[$2]);

export const filterObject = (params: { [key: string]: string | number }, ...filters: any[]) =>
	Object.keys(params).reduce((prms: { [key: string]: string | number }, key) => {
		if (!filters.includes(params[key])) {
			prms[key] = params[key];
		}
		return prms;
	}, {});
