import {
	NodeOperationError,
	sleep,
	type IDataObject,
	type IExecuteSingleFunctions,
	type INodeExecutionData,
} from 'n8n-workflow';

export const POLL_INTERVAL_MS = 3000;
const DEFAULT_MAX_WAIT_SECONDS = 540;
const STATUS_URL = 'https://api.neuralverge.ai/functions/v1/get-session-status';

export async function waitForResearch(
	this: IExecuteSingleFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const waitForCompletion = this.getNodeParameter('waitForCompletion', true) as boolean;
	if (!waitForCompletion) {
		return items;
	}

	const sessionId = items[0]?.json?.session_id;
	if (typeof sessionId !== 'string' || sessionId === '') {
		throw new NodeOperationError(this.getNode(), 'NeuralVerge did not return a session ID', {
			description: JSON.stringify(items[0]?.json ?? {}),
		});
	}

	const maxWaitSeconds = this.getNodeParameter(
		'options.maxWaitSeconds',
		DEFAULT_MAX_WAIT_SECONDS,
	) as number;
	const deadline = Date.now() + maxWaitSeconds * 1000;

	for (;;) {
		const status = (await this.helpers.httpRequestWithAuthentication.call(this, 'neuralVergeApi', {
			method: 'GET',
			url: STATUS_URL,
			qs: { session_id: sessionId },
			json: true,
		})) as IDataObject;

		if (status.status === 'complete') {
			return [{ json: status }];
		}
		if (status.status === 'failed') {
			throw new NodeOperationError(
				this.getNode(),
				`NeuralVerge research task ${sessionId} failed`,
				{
					description: JSON.stringify(status.results ?? status),
				},
			);
		}
		if (Date.now() + POLL_INTERVAL_MS > deadline) {
			return [{ json: { ...status, session_id: sessionId, timed_out: true } }];
		}
		await sleep(POLL_INTERVAL_MS);
	}
}
