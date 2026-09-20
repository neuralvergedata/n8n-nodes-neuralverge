import type { INodeProperties } from 'n8n-workflow';

export const linkedinDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['linkedin'] } },
		options: [
			{
				name: 'Find LinkedIn Profile by Name and Company',
				value: 'findProfile',
				action: 'Find a profile by name and company',
				description: 'Find a LinkedIn profile URL from a full name and a company name or domain',
				routing: {
					request: { method: 'POST', url: '/run-linkedin-domain' },
				},
			},
			{
				name: 'Get LinkedIn Profile with Email',
				value: 'getProfileWithEmail',
				action: 'Get a profile with email',
				description: 'Get LinkedIn profile details plus a work email when available',
				routing: {
					request: { method: 'POST', url: '/run-linkedin-email' },
				},
			},
			{
				name: 'List Company Employees',
				value: 'listCompanyEmployees',
				action: 'List company employees',
				description: 'List employees of one or more LinkedIn companies, with optional filters',
				routing: {
					request: { method: 'POST', url: '/run-linkedin-company-employee' },
				},
			},
			{
				name: 'Search LinkedIn Companies',
				value: 'searchCompanies',
				action: 'Search companies',
				description: 'Search LinkedIn companies by keyword, size, industry and location',
				routing: {
					request: { method: 'POST', url: '/run-linkedin-company-search' },
				},
			},
			{
				name: 'Search LinkedIn People',
				value: 'searchPeople',
				action: 'Search people',
				description:
					'Search LinkedIn people by keyword, company, title, seniority, function and location',
				routing: {
					request: { method: 'POST', url: '/run-linkedin-people-search' },
				},
			},
		],
		default: 'findProfile',
	},
	{
		displayName: 'LinkedIn Profile URL',
		name: 'profileUrl',
		type: 'string',
		default: '',
		required: true,
		description: 'Full LinkedIn profile URL, for example https://www.linkedin.com/in/janedoe/',
		displayOptions: { show: { resource: ['linkedin'], operation: ['getProfileWithEmail'] } },
		routing: { send: { type: 'body', property: 'username' } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['linkedin'], operation: ['getProfileWithEmail'] } },
		options: [
			{
				displayName: 'Include Email',
				name: 'includeEmail',
				type: 'boolean',
				default: true,
				description: 'Whether to also look up a work email for the profile',
				routing: { send: { type: 'body', property: 'includeEmail' } },
			},
		],
	},
	{
		displayName: 'Full Name',
		name: 'fullName',
		type: 'string',
		default: '',
		required: true,
		description: 'Full name of the person, for example Jane Doe',
		displayOptions: { show: { resource: ['linkedin'], operation: ['findProfile'] } },
		routing: { send: { type: 'body', property: 'full_name' } },
	},
	{
		displayName: 'Company or Domain',
		name: 'companyOrDomain',
		type: 'string',
		default: '',
		required: true,
		description: 'Company name or website domain, for example example.com',
		displayOptions: { show: { resource: ['linkedin'], operation: ['findProfile'] } },
		routing: { send: { type: 'body', property: 'company_or_domain' } },
	},
	{
		displayName: 'Search Query',
		name: 'searchQuery',
		type: 'string',
		default: '',
		required: true,
		description: 'Keywords to search for, for example AI companies',
		displayOptions: { show: { resource: ['linkedin'], operation: ['searchCompanies'] } },
		routing: { send: { type: 'body', property: 'searchQuery' } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['linkedin'], operation: ['searchCompanies'] } },
		options: [
			{
				displayName: 'Company Sizes',
				name: 'companySize',
				type: 'string',
				default: '',
				description:
					'Company size buckets, for example 51-200. Separate multiple values with commas.',
				routing: {
					send: {
						type: 'body',
						property: 'companySize',
						value: '={{ $value.split(",").map((v) => v.trim()).filter((v) => v) }}',
					},
				},
			},
			{
				displayName: 'Detail Level',
				name: 'scraperMode',
				type: 'options',
				options: [
					{ name: 'Full (All Profile Fields)', value: 'full' },
					{ name: 'Short (Faster, Fewer Fields)', value: 'short' },
				],
				default: 'short',
				description: 'How much detail to return per company',
				routing: { send: { type: 'body', property: 'scraperMode' } },
			},
			{
				displayName: 'Industries',
				name: 'industryIds',
				type: 'string',
				default: '',
				description:
					'Industry names or LinkedIn industry IDs, for example Software. Separate multiple values with commas.',
				routing: {
					send: {
						type: 'body',
						property: 'industryIds',
						value: '={{ $value.split(",").map((v) => v.trim()).filter((v) => v) }}',
					},
				},
			},
			{
				displayName: 'Locations',
				name: 'locations',
				type: 'string',
				default: '',
				description:
					'Locations to filter by, for example Amsterdam. Separate multiple values with commas.',
				routing: {
					send: {
						type: 'body',
						property: 'locations',
						value: '={{ $value.split(",").map((v) => v.trim()).filter((v) => v) }}',
					},
				},
			},
			{
				displayName: 'Max Items',
				name: 'maxItems',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 5,
				description: 'Maximum number of companies to return. Each company is billed.',
				routing: { send: { type: 'body', property: 'maxItems' } },
			},
			{
				displayName: 'Start Page',
				name: 'startPage',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 1,
				description: 'Result page to start from',
				routing: { send: { type: 'body', property: 'startPage' } },
			},
		],
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['linkedin'], operation: ['searchPeople'] } },
		options: [
			{
				displayName: 'Company Headcount',
				name: 'companyHeadcountFilter',
				type: 'string',
				default: '',
				description:
					'Company headcount buckets, for example 51-200. Separate multiple values with commas.',
				routing: {
					send: {
						type: 'body',
						property: 'companyHeadcountFilter',
						value: '={{ $value.split(",").map((v) => v.trim()).filter((v) => v) }}',
					},
				},
			},
			{
				displayName: 'Current Companies',
				name: 'currentCompany',
				type: 'string',
				default: '',
				description:
					'Current employers to match, for example Example Inc. Separate multiple values with commas.',
				routing: {
					send: {
						type: 'body',
						property: 'currentCompany',
						value: '={{ $value.split(",").map((v) => v.trim()).filter((v) => v) }}',
					},
				},
			},
			{
				displayName: 'Current Job Titles',
				name: 'currentJobTitleFilter',
				type: 'string',
				default: '',
				description:
					'Current job titles to match, for example Recruiter. Separate multiple values with commas.',
				routing: {
					send: {
						type: 'body',
						property: 'currentJobTitleFilter',
						value: '={{ $value.split(",").map((v) => v.trim()).filter((v) => v) }}',
					},
				},
			},
			{
				displayName: 'Detail Level',
				name: 'scraperMode',
				type: 'options',
				options: [
					{ name: 'Full (All Profile Fields)', value: 'full' },
					{ name: 'Short (Faster, Fewer Fields)', value: 'short' },
				],
				default: 'short',
				description: 'How much detail to return per profile',
				routing: { send: { type: 'body', property: 'scraperMode' } },
			},
			{
				displayName: 'First Names',
				name: 'firstNames',
				type: 'string',
				default: '',
				description: 'First names to match. Separate multiple values with commas.',
				routing: {
					send: {
						type: 'body',
						property: 'firstNames',
						value: '={{ $value.split(",").map((v) => v.trim()).filter((v) => v) }}',
					},
				},
			},
			{
				displayName: 'Industry IDs',
				name: 'industryIds',
				type: 'string',
				default: '',
				description: 'LinkedIn industry IDs to filter by. Separate multiple values with commas.',
				routing: {
					send: {
						type: 'body',
						property: 'industryIds',
						value: '={{ $value.split(",").map((v) => v.trim()).filter((v) => v) }}',
					},
				},
			},
			{
				displayName: 'Job Functions',
				name: 'functionFilter',
				type: 'string',
				default: '',
				description:
					'Job functions to match, for example Engineering. Separate multiple values with commas.',
				routing: {
					send: {
						type: 'body',
						property: 'functionFilter',
						value: '={{ $value.split(",").map((v) => v.trim()).filter((v) => v) }}',
					},
				},
			},
			{
				displayName: 'Last Names',
				name: 'lastNames',
				type: 'string',
				default: '',
				description: 'Last names to match. Separate multiple values with commas.',
				routing: {
					send: {
						type: 'body',
						property: 'lastNames',
						value: '={{ $value.split(",").map((v) => v.trim()).filter((v) => v) }}',
					},
				},
			},
			{
				displayName: 'Locations',
				name: 'locations',
				type: 'string',
				default: '',
				description:
					'Locations to filter by, for example Amsterdam or United States. Separate multiple values with commas.',
				routing: {
					send: {
						type: 'body',
						property: 'locations',
						value: '={{ $value.split(",").map((v) => v.trim()).filter((v) => v) }}',
					},
				},
			},
			{
				displayName: 'Max Results',
				name: 'maxResults',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 25,
				description: 'Maximum number of people to return. Billed in blocks of 25.',
				routing: { send: { type: 'body', property: 'maxResults' } },
			},
			{
				displayName: 'Past Companies',
				name: 'pastCompany',
				type: 'string',
				default: '',
				description: 'Past employers to match. Separate multiple values with commas.',
				routing: {
					send: {
						type: 'body',
						property: 'pastCompany',
						value: '={{ $value.split(",").map((v) => v.trim()).filter((v) => v) }}',
					},
				},
			},
			{
				displayName: 'Past Job Titles',
				name: 'pastJobTitle',
				type: 'string',
				default: '',
				description: 'Past job titles to match. Separate multiple values with commas.',
				routing: {
					send: {
						type: 'body',
						property: 'pastJobTitle',
						value: '={{ $value.split(",").map((v) => v.trim()).filter((v) => v) }}',
					},
				},
			},
			{
				displayName: 'Search Query',
				name: 'searchQuery',
				type: 'string',
				default: '',
				description: 'Keywords to search for, for example Example Inc. recruiter.',
				routing: { send: { type: 'body', property: 'searchQuery' } },
			},
			{
				displayName: 'Seniority Levels',
				name: 'seniorityLevelFilter',
				type: 'string',
				default: '',
				description:
					'Seniority levels to match, for example Director. Separate multiple values with commas.',
				routing: {
					send: {
						type: 'body',
						property: 'seniorityLevelFilter',
						value: '={{ $value.split(",").map((v) => v.trim()).filter((v) => v) }}',
					},
				},
			},
			{
				displayName: 'Start Page',
				name: 'startPage',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 1,
				description: 'Result page to start from',
				routing: { send: { type: 'body', property: 'startPage' } },
			},
			{
				displayName: 'Years at Current Company',
				name: 'yearsAtCurrentCompanyFilter',
				type: 'string',
				default: '',
				description: 'Tenure buckets at the current company. Separate multiple values with commas.',
				routing: {
					send: {
						type: 'body',
						property: 'yearsAtCurrentCompanyFilter',
						value: '={{ $value.split(",").map((v) => v.trim()).filter((v) => v) }}',
					},
				},
			},
			{
				displayName: 'Years of Experience',
				name: 'yearsOfExperienceFilter',
				type: 'string',
				default: '',
				description:
					'Total years-of-experience buckets to match. Separate multiple values with commas.',
				routing: {
					send: {
						type: 'body',
						property: 'yearsOfExperienceFilter',
						value: '={{ $value.split(",").map((v) => v.trim()).filter((v) => v) }}',
					},
				},
			},
		],
	},
	{
		displayName: 'LinkedIn Company URLs',
		name: 'companies',
		type: 'string',
		default: '',
		required: true,
		description:
			'LinkedIn company page URLs, for example https://www.linkedin.com/company/example/. Separate multiple values with commas.',
		displayOptions: { show: { resource: ['linkedin'], operation: ['listCompanyEmployees'] } },
		routing: {
			send: {
				type: 'body',
				property: 'companies',
				value: '={{ $value.split(",").map((v) => v.trim()).filter((v) => v) }}',
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['linkedin'], operation: ['listCompanyEmployees'] } },
		options: [
			{
				displayName: 'Company Headcount',
				name: 'companyHeadcountFilter',
				type: 'string',
				default: '',
				description:
					'Company headcount buckets, for example 51-200. Separate multiple values with commas.',
				routing: {
					send: {
						type: 'body',
						property: 'companyHeadcountFilter',
						value: '={{ $value.split(",").map((v) => v.trim()).filter((v) => v) }}',
					},
				},
			},
			{
				displayName: 'Current Job Titles',
				name: 'currentJobTitleFilter',
				type: 'string',
				default: '',
				description:
					'Current job titles to match, for example Recruiter. Separate multiple values with commas.',
				routing: {
					send: {
						type: 'body',
						property: 'currentJobTitleFilter',
						value: '={{ $value.split(",").map((v) => v.trim()).filter((v) => v) }}',
					},
				},
			},
			{
				displayName: 'Detail Level',
				name: 'scraperMode',
				type: 'options',
				options: [
					{ name: 'Full (All Profile Fields)', value: 'full' },
					{ name: 'Short (Faster, Fewer Fields)', value: 'short' },
				],
				default: 'short',
				description: 'How much detail to return per profile',
				routing: { send: { type: 'body', property: 'scraperMode' } },
			},
			{
				displayName: 'Industry IDs',
				name: 'industryIds',
				type: 'string',
				default: '',
				description: 'LinkedIn industry IDs to filter by. Separate multiple values with commas.',
				routing: {
					send: {
						type: 'body',
						property: 'industryIds',
						value: '={{ $value.split(",").map((v) => v.trim()).filter((v) => v) }}',
					},
				},
			},
			{
				displayName: 'Job Functions',
				name: 'functionFilter',
				type: 'string',
				default: '',
				description:
					'Job functions to match, for example Engineering. Separate multiple values with commas.',
				routing: {
					send: {
						type: 'body',
						property: 'functionFilter',
						value: '={{ $value.split(",").map((v) => v.trim()).filter((v) => v) }}',
					},
				},
			},
			{
				displayName: 'Locations',
				name: 'locations',
				type: 'string',
				default: '',
				description:
					'Locations to filter by, for example Amsterdam or United States. Separate multiple values with commas.',
				routing: {
					send: {
						type: 'body',
						property: 'locations',
						value: '={{ $value.split(",").map((v) => v.trim()).filter((v) => v) }}',
					},
				},
			},
			{
				displayName: 'Max Results',
				name: 'maxResults',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 10,
				description: 'Maximum number of employees to return. Each profile is billed.',
				routing: { send: { type: 'body', property: 'maxResults' } },
			},
			{
				displayName: 'Past Job Titles',
				name: 'pastJobTitle',
				type: 'string',
				default: '',
				description: 'Past job titles to match. Separate multiple values with commas.',
				routing: {
					send: {
						type: 'body',
						property: 'pastJobTitle',
						value: '={{ $value.split(",").map((v) => v.trim()).filter((v) => v) }}',
					},
				},
			},
			{
				displayName: 'Search Query',
				name: 'searchQuery',
				type: 'string',
				default: '',
				description: 'Optional keywords, for example Recruiter',
				routing: { send: { type: 'body', property: 'searchQuery' } },
			},
			{
				displayName: 'Seniority Levels',
				name: 'seniorityLevelFilter',
				type: 'string',
				default: '',
				description:
					'Seniority levels to match, for example Director. Separate multiple values with commas.',
				routing: {
					send: {
						type: 'body',
						property: 'seniorityLevelFilter',
						value: '={{ $value.split(",").map((v) => v.trim()).filter((v) => v) }}',
					},
				},
			},
			{
				displayName: 'Start Page',
				name: 'startPage',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 1,
				description: 'Result page to start from',
				routing: { send: { type: 'body', property: 'startPage' } },
			},
			{
				displayName: 'Years at Current Company',
				name: 'yearsAtCurrentCompanyFilter',
				type: 'string',
				default: '',
				description: 'Tenure buckets at the current company. Separate multiple values with commas.',
				routing: {
					send: {
						type: 'body',
						property: 'yearsAtCurrentCompanyFilter',
						value: '={{ $value.split(",").map((v) => v.trim()).filter((v) => v) }}',
					},
				},
			},
			{
				displayName: 'Years of Experience',
				name: 'yearsOfExperienceFilter',
				type: 'string',
				default: '',
				description:
					'Total years-of-experience buckets to match. Separate multiple values with commas.',
				routing: {
					send: {
						type: 'body',
						property: 'yearsOfExperienceFilter',
						value: '={{ $value.split(",").map((v) => v.trim()).filter((v) => v) }}',
					},
				},
			},
		],
	},
];
