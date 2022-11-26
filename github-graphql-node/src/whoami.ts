import { githubClient } from './apollo-client';
import { WhoAmIQuery, WhoAmI } from './generated/graphql';
import { getConfig } from './config';

export async function getUser() {
    const { GitHubPersonalAccessToken, GitHubGraphQLUrl } = getConfig();

    const result = await githubClient(
        GitHubPersonalAccessToken,
        GitHubGraphQLUrl
    ).query<WhoAmIQuery>({
        query: WhoAmI,
    });

    return result.data.viewer.login;
}

