import React, { Fragment } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { Loader, Dimmer, Button } from "semantic-ui-react";
const GET_LAUNCHES = gql`
  query launchList($after: String) {
    launches(after: $after) {
      cursor
      hasMore
      launches {
        id
        isBooked
        site
        rocket {
          id
          name
        }
        mission {
          name
          missionPatch
        }
      }
    }
  }
`;

function Launches() {
  console.log("rerender");
  return (
    <Query query={GET_LAUNCHES}>
      {({ data, loading, error, fetchMore }) => {
        if (loading)
          return (
            <Dimmer active>
              <Loader />
            </Dimmer>
          );
        if (error) console.log(error);
        const handleLoadMore = () => {
          return fetchMore({
            variables: {
              after: data.launches.cursor
            },
            updateQuery: (prev, { fetchMoreResult, ...rest }) => {
              if (!fetchMoreResult) return prev;
              return {
                ...fetchMoreResult,
                launches: {
                  ...fetchMoreResult.launches,
                  launches: [
                    ...prev.launches.launches,
                    ...fetchMoreResult.launches.launches
                  ]
                }
              };
            }
          });
        };
        return (
          <Fragment>
            <Button onClick={handleLoadMore}>加载更多</Button>
            {data.launches &&
              data.launches.launches &&
              data.launches.launches.map(launch => {
                return <p key={launch.id}>{launch.site}</p>;
              })}
          </Fragment>
        );
      }}
    </Query>
  );
}
export default Launches;
