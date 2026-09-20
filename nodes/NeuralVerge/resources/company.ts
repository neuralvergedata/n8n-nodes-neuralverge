import type { INodeProperties } from 'n8n-workflow';

export const companyDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['company'] } },
		options: [
			{
				name: 'Get Company Funding',
				value: 'getFunding',
				action: 'Get company funding',
				description:
					'Get funding rounds, investors and firmographics from a Crunchbase organization URL',
				routing: {
					request: { method: 'POST', url: '/run-crunchbase-company' },
				},
			},
		],
		default: 'getFunding',
	},
	{
		displayName: 'Crunchbase URL',
		name: 'url',
		type: 'string',
		default: '',
		required: true,
		description:
			'Crunchbase organization URL, for example https://www.crunchbase.com/organization/example',
		displayOptions: { show: { resource: ['company'], operation: ['getFunding'] } },
		routing: { send: { type: 'body', property: 'url' } },
	},
];
