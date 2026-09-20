import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class NeuralVergeApi implements ICredentialType {
	name = 'neuralVergeApi';

	displayName = 'NeuralVerge API';

	icon: Icon = {
		light: 'file:../icons/neuralverge.svg',
		dark: 'file:../icons/neuralverge.dark.svg',
	};

	documentationUrl =
		'https://github.com/neuralvergedata/n8n-nodes-neuralverge?tab=readme-ov-file#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Your NeuralVerge API key. Sign in at https://app.neuralverge.ai and open Settings → API.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'x-api-key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.neuralverge.ai/functions/v1',
			url: '/run-email-validation',
			method: 'POST',
			body: { email: 'test@example.com' },
		},
	};
}
