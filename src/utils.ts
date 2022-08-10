export const IMDB_URL = "https://www.imdb.com";

export const IMDB_MEDIA_URL = "https://v2.sg.media-imdb.com";

export const IMDB_GRAPHQL_URL = "https://api.graphql.imdb.com";


export const cleanQuery = (query: string) =>
	query.replace(" ", "_").replace(/\W+/, "").toLowerCase();

export const formatImage = (image?: string) => {
	if (!image) return;
	return image.slice(image.lastIndexOf("/") + 1).replace(/._(V1.|CR)(.*?).(jpg|png)/, ".jpg");
};


