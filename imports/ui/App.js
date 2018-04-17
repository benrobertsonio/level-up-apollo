import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { withApollo } from 'react-apollo';

import GoalForm from './GoalForm';
import Goal from './resolutions/Goal';
import ResolutionForm from './ResolutionForm';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';

const App = ({ loading, resolutions, client, user }) => {
  if (loading) return null;
  return (
    <div>
      {user._id ? (
        <button
          onClick={() => {
            Meteor.logout();
            client.resetStore();
          }}
        >
          Logout
        </button>
      ) : (
        <div>
          <RegisterForm client={client} />
          <LoginForm client={client} />
        </div>
      )}

      <ResolutionForm />
      <ul>
        {resolutions.map((resolution) => (
          <li key={resolution._id}>
            <span
              style={{
                textDecoration: resolution.completed ? 'line-through' : 'none'
              }}
            >
              {resolution.name}
            </span>
            <ul>
              {resolution.goals.map((goal) => (
                <Goal goal={goal} key={goal._id} />
              ))}
            </ul>
            <GoalForm resolutionId={resolution._id} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const resolutionsQuery = gql`
  query Resolutions {
    resolutions {
      _id
      name
      completed
      goals {
        _id
        name
        completed
      }
    }
    user {
      _id
    }
  }
`;

export default graphql(resolutionsQuery, {
  props: ({ data }) => ({ ...data })
})(withApollo(App));
