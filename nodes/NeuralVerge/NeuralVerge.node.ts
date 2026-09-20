import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { aiDescription } from './resources/ai';
import { amazonDescription } from './resources/amazon';
import { companyDescription } from './resources/company';
import { contactDescription } from './resources/contact';
import { linkedinDescription } from './resources/linkedin';

export class NeuralVerge implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'NeuralVerge',
		name: 'neuralVerge',
		icon: {
			light: 'file:../../icons/neuralverge.svg',
			dark: 'file:../../icons/neuralverge.dark.svg',
		},
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Company and person business intelligence: email and phone lookup, email finder, company funding, LinkedIn, Amazon, web search and AI research',
		defaults: {
			name: 'NeuralVerge',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'neuralVergeApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.neuralverge.ai/functions/v1',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'AI', value: 'ai' },
					{ name: 'Amazon', value: 'amazon' },
					{ name: 'Company', value: 'company' },
					{ name: 'Contact', value: 'contact' },
					{ name: 'LinkedIn', value: 'linkedin' },
				],
				default: 'contact',
			},
			...aiDescription,
			...amazonDescription,
			...companyDescription,
			...contactDescription,
			...linkedinDescription,
		],
	};
}
