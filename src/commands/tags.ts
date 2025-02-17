import { SapphireGemId } from '#constants/emotes';
import type { FastifyResponse } from '#types/Api';
import { errorResponse, interactionResponse, selectMenuResponse, sendJson } from '#utils/responseHelpers';
import { findSimilar, findTag, mapTagSimilarityEntry } from '#utils/tags';
import { inlineCode } from '@discordjs/builders';
import type { Snowflake } from 'discord-api-types/v9';

export function showTag({ response, query, target }: ShowTagParameters): FastifyResponse {
	const content = findTag(query, target);

	if (content) {
		return sendJson(
			response,
			interactionResponse({
				content,
				users: target ? [target] : []
			})
		);
	}

	const similar = findSimilar(query);

	if (similar.length) {
		return sendJson(
			response,
			selectMenuResponse({
				selectMenuOptions: similar.map(mapTagSimilarityEntry),
				customId: `tag|${target ?? ''}`,
				content: `${SapphireGemId} Could not find a tag with name or alias ${inlineCode(query)}. Select a similar tag to send instead:`
			})
		);
	}

	return sendJson(response, errorResponse({ content: `Could not find a tag with name or alias similar to ${inlineCode(query)}` }));
}

interface ShowTagParameters {
	response: FastifyResponse;
	query: string;
	target: Snowflake;
}
