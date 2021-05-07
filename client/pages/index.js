import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  return <h1>You are {currentUser ? '' : 'not'} signed in</h1>;
};

LandingPage.getInitialProps = async (context) => {
  // We pass the entire context as argument, and then, inside build-client, we destructure it in order to
  // get the request parameter
  // We we call buildClient we get an axios instance
  const client = buildClient(context);
  const { data } = await client.get('/api/users/current-user');

  return data;
};

export default LandingPage;
