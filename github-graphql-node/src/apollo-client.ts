import {
    ApolloClient,
    HttpLink,
    InMemoryCache,
    NormalizedCacheObject,
} from '@apollo/client/core';
import fetch from 'cross-fetch';

export function githubClient(
    personalAccessToken: string,
    graphQlUrl: string
): ApolloClient<NormalizedCacheObject> {
    if (!personalAccessToken) {
        throw new Error('You need to provide a Github personal access token.');
    }

    if (!graphQlUrl) {
        throw new Error('You need to provide a Github GitHub GraphQL URL.');
    }

    return new ApolloClient({
        link: new HttpLink({
            uri: graphQlUrl,
            headers: {
                authorization: `token ${process.env.GITHUB_TOKEN}`,
            },
            fetch,
        }),
        cache: new InMemoryCache(),
    });
}
