export interface ComicList {
	id: string | number;
	slug: string;
	title: string;
	chapter: string;
	cover: string;
	time: string;
}

export interface Chapter {
	id: string;
	title: string;
	date: string;
}

export interface ComicDetail {
	id: string;
	title: string;
	author: string;
	status: string;
	description: string;
	cover: string;
	genres: string[];
	chapters: Chapter[];
}
