import { githubClient } from './apollo-client';
import {
    AggregatedOrgRepos,
    AggregatedOrgReposQuery,
    AggregatedOrgReposQueryVariables,
} from './generated/graphql';
import { getConfig } from './config';

export async function getRepos(organizationName: string='Azure-Samples') {

    const appConfig = getConfig();

    let queryVariables: AggregatedOrgReposQueryVariables = {
        organization: organizationName,
        after: null,
        pageSize: appConfig.CursorSize,
    };

    let returnedData: any;
    let hasNextPage = true;
    let data = [];
    let after: string | null = null;

    do {
        // loop starts here
        const result = await githubClient(
            appConfig.GitHubPersonalAccessToken,
            appConfig.GitHubGraphQLUrl
        ).query<AggregatedOrgReposQuery>({
            query: AggregatedOrgRepos,
            variables: queryVariables,
        });

        if (!result?.errors && !result?.error && result?.data) {
            returnedData = result?.data;

            if (returnedData.organization.repositories.totalCount > 0) {
                hasNextPage =
                    returnedData.organization.repositories.pageInfo.hasNextPage;
                after =
                    returnedData.organization.repositories.pageInfo.endCursor;

                data.push(...returnedData?.organization?.repositories?.edges);

                if (hasNextPage && after) {
                    queryVariables.after =
                        returnedData?.organization?.repositories.pageInfo.endCursor;
                }
            }
        } else {
            throw Error(result?.error?.message);
        }
    } while (hasNextPage && after !== null && after !== '');
    return data;
}
