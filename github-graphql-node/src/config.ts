require('dotenv').config();

export type AppConfiguration = {
    GitHubGraphQLUrl: string;
    GitHubPersonalAccessToken: string;
    CursorSize: number;
    Environment: 'development' | 'production';
};

export function getConfig() {
    if (!process.env.GITHUB_PERSONAL_ACCESS_TOKEN)
        throw Error('App config not found: GITHUB_PERSONAL_ACCESS_TOKEN');
    if (!process.env.GITHUB_GRAPHQL_ENDPOINT)
        throw Error('App config not found: GITHUB_GRAPHQL_ENDPOINT');

    const config: AppConfiguration = {
        GitHubPersonalAccessToken:
            process.env.GITHUB_PERSONAL_ACCESS_TOKEN || '',
        GitHubGraphQLUrl: process.env.GITHUB_GRAPHQL_ENDPOINT || '',
        CursorSize: +(process.env.GRAPHQL_CURSOR_SIZE || 100),
        Environment:
            process.env?.NODE_ENV?.toLowerCase() === 'development'
                ? 'development'
                : 'production',
    };
    return config;
}
