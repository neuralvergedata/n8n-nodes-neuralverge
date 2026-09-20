'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const dist = path.join(__dirname, '..', 'dist');
const { NeuralVerge } = require(path.join(dist, 'nodes/NeuralVerge/NeuralVerge.node.js'));
const { NeuralVergeApi } = require(path.join(dist, 'credentials/NeuralVergeApi.credentials.js'));
const { waitForResearch } = require(path.join(dist, 'nodes/NeuralVerge/shared/research.js'));
const endpoints = require('./endpoints.json');

const description = new NeuralVerge().description;
const properties = description.properties;

function operations() {
	const list = [];
	for (const prop of properties) {
		if (prop.name !== 'operation') continue;
		const resource = prop.displayOptions.show.resource[0];
		for (const option of prop.options) {
			list.push({ resource, operation: option.value, option });
		}
	}
	return list;
}

function fieldsFor(resource, operation) {
	return properties.filter((p) => {
		const show = p.displayOptions && p.displayOptions.show;
		return (
			show &&
			show.resource &&
			show.resource.includes(resource) &&
			show.operation &&
			show.operation.includes(operation)
		);
	});
}

function sentPaths(fields) {
	const paths = [];
	for (const field of fields) {
		if (field.routing && field.routing.send) paths.push(field.routing.send);
		for (const child of field.options || []) {
			if (child.routing && child.routing.send) paths.push(child.routing.send);
		}
	}
	return paths;
}

test('node is usable as an AI tool and uses the NeuralVerge credential', () => {
	assert.equal(description.usableAsTool, true);
	assert.equal(description.requestDefaults.baseURL, 'https://api.neuralverge.ai/functions/v1');
	assert.deepEqual(description.credentials, [{ name: 'neuralVergeApi', required: true }]);
	const resources = properties.find((p) => p.name === 'resource').options.map((o) => o.name);
	assert.deepEqual(resources.sort(), ['AI', 'Amazon', 'Company', 'Contact', 'LinkedIn']);
});

test('every one of the 20 endpoints has exactly one operation', () => {
	const urls = operations().map((o) => o.option.routing.request.url.replace('/', ''));
	assert.equal(urls.length, 20);
	assert.deepEqual([...urls].sort(), Object.keys(endpoints).sort());
});

for (const { resource, operation, option } of operations()) {
	const slug = option.routing.request.url.replace('/', '');
	test(`${resource}/${operation} -> ${slug} matches the OpenAPI spec`, () => {
		const spec = endpoints[slug];
		assert.equal(option.routing.request.method, spec.method);
		const sends = sentPaths(fieldsFor(resource, operation));
		if (spec.query) {
			assert.deepEqual(
				sends.filter((s) => s.type === 'query').map((s) => s.property),
				spec.query,
			);
			return;
		}
		const bodyPaths = sends.filter((s) => s.type === 'body').map((s) => s.property);
		for (const p of bodyPaths) {
			assert.ok(spec.properties.includes(p), `${p} is not in the spec for ${slug}`);
		}
		for (const required of spec.required) {
			if (required === 'settings') {
				const anchored = fieldsFor(resource, operation).some(
					(f) => f.routing && f.routing.send && f.routing.send.property.startsWith('settings.'),
				);
				assert.ok(anchored, `${slug} must always send a settings.* field`);
			} else {
				const field = fieldsFor(resource, operation).find(
					(f) => f.routing && f.routing.send && f.routing.send.property === required,
				);
				assert.ok(field, `${slug} is missing required ${required}`);
				assert.equal(field.required, true, `${required} should be required`);
			}
		}
	});
}

test('credential sends x-api-key and tests with the email verification call', () => {
	const credential = new NeuralVergeApi();
	assert.equal(credential.name, 'neuralVergeApi');
	assert.deepEqual(credential.authenticate.properties.headers, {
		'x-api-key': '={{$credentials.apiKey}}',
	});
	assert.equal(credential.authenticate.properties.headers.Authorization, undefined);
	assert.deepEqual(credential.test.request, {
		baseURL: 'https://api.neuralverge.ai/functions/v1',
		url: '/run-email-validation',
		method: 'POST',
		body: { email: 'test@example.com' },
	});
});

function fakeContext({ params, responses }) {
	const calls = [];
	return {
		calls,
		getNode: () => ({ name: 'NeuralVerge', type: 'n8n-nodes-neuralverge.neuralVerge' }),
		getNodeParameter: (name, fallback) => (name in params ? params[name] : fallback),
		helpers: {
			httpRequestWithAuthentication: async function (credential, options) {
				calls.push({ credential, options });
				return responses.shift();
			},
		},
	};
}

test('research returns the session immediately when waiting is off', async () => {
	const ctx = fakeContext({ params: { waitForCompletion: false }, responses: [] });
	const items = [{ json: { session_id: 'r0' } }];
	assert.deepEqual(await waitForResearch.call(ctx, items), items);
	assert.equal(ctx.calls.length, 0);
});

test('research polls get-session-status until complete', async () => {
	const ctx = fakeContext({
		params: { waitForCompletion: true, 'options.maxWaitSeconds': 60 },
		responses: [
			{ session_id: 'r1', status: 'running' },
			{ session_id: 'r1', status: 'complete', results: { human: '# Report', total_points: 50 } },
		],
	});
	const out = await waitForResearch.call(ctx, [{ json: { session_id: 'r1' } }]);
	assert.equal(out[0].json.status, 'complete');
	assert.equal(ctx.calls.length, 2);
	for (const call of ctx.calls) {
		assert.equal(call.credential, 'neuralVergeApi');
		assert.equal(call.options.method, 'GET');
		assert.equal(call.options.url, 'https://api.neuralverge.ai/functions/v1/get-session-status');
		assert.deepEqual(call.options.qs, { session_id: 'r1' });
	}
});

test('research throws when the task fails', async () => {
	const ctx = fakeContext({
		params: { waitForCompletion: true },
		responses: [{ session_id: 'r2', status: 'failed', results: { error: 'upstream' } }],
	});
	await assert.rejects(waitForResearch.call(ctx, [{ json: { session_id: 'r2' } }]), /failed/);
});

test('research returns timed_out when the wait expires', async () => {
	const ctx = fakeContext({
		params: { waitForCompletion: true, 'options.maxWaitSeconds': 0 },
		responses: [{ session_id: 'r3', status: 'queued' }],
	});
	const out = await waitForResearch.call(ctx, [{ json: { session_id: 'r3' } }]);
	assert.equal(out[0].json.timed_out, true);
	assert.equal(out[0].json.status, 'queued');
});
