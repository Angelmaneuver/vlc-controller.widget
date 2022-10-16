import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
	ignoreAttributes:     false,
	attributeNamePrefix : '',
});

function playlist(xml: string): [
	play:    Array<Record<string, string>>,
	media:   Array<Record<string, string>>,
	playing: string | undefined,
] {
	const xml2json     = parser.parse(xml);
	const playlist     = xml2json.node.node[0];
	const medialibrary = xml2json.node.node[1];
	let   play         = [] as Array<Record<string, string>>;
	let   media        = [] as Array<Record<string, string>>;
	let   playing      = undefined;

	if ('leaf' in playlist) {
		[play, playing] = playlist2List(playlist);
	}

	if ('leaf' in medialibrary) {
		const [templist, temp] = playlist2List(playlist);

		media   = templist;
		playing = temp ? temp : playing;
	}

	return [play, media, playing];
}

function playlist2List(
	json: any,
): [list: Array<Record<string, string>>, playing: string | undefined] {
	const list:    Array<Record<string, string>> = [];
	let   playing: string | undefined            = undefined;

	(json.leaf as Array<Record<string, string>>).forEach(
		(item) => {
			list.push({
				id:   item.id,
				name: item.name,
				uri:  item.uri,
			});

			if ('current' in item) {
				playing = item.name;
			}
		}
	);

	return [list, playing];
}

function status(xml: string) {
	const xml2json = parser.parse(xml);
	const state    = xml2json.root.state;
	const volume   = xml2json.root.volume;

	return {
		state:  state,
		volume: volume,
	};
}

export {
	playlist,
	status,
};
