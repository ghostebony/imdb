export type TitleId = `tt${number}${number}${number}${number}${number}${number}${number}`;
export type ListId = `ls${number}${number}${number}${number}${number}${number}${number}`;

export type RatingRange = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type Q =
	| "feature"
	| "short"
	| "TV short"
	| "TV movie"
	| "TV series"
	| "TV mini-series"
	| "TV special"
	| "TV episode"
	| "video"
	| "radio series"
	| "radio episode"
	| "video game";

export type Qid =
	| "movie"
	| "short"
	| "tvShort"
	| "tvMovie"
	| "tvSeries"
	| "tvMiniSeries"
	| "tvspecial"
	| "tvEpisode"
	| "video"
	| "radioSeries"
	| "radioEpisode"
	| "videoGame";

export type SearchContainer = {
	d: Search[];
	q: string;
	v: number;
};

export type Search = {
	i?: {
		height: number;
		imageUrl: string;
		width: number;
	};
	id: string;
	l: string;
	q?: Q;
	qid?: Qid;
	rank: number;
	s: string;
	v?: {
		i: {
			height: number;
			imageUrl: string;
			width: number;
		};
		id: string;
		l: string;
		s: string;
	}[];
	vt?: number;
	y?: number;
	yr?: string;
};
