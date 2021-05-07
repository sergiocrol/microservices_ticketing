import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';

import Header from '../components/header';

// When NextJS is showing in the browser a component, what is doing under the hood is wrapping it inside this
// _app component. For example, when it show pages/index.js component, this component will be "Component" arg inside
// the function we're declaring right now. While the pageProps are the set of components we are trying to pass inside
// the index component.
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />;
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/current-user');

  // If we use getInitialProps inside our appContext, all the getInitialProps
  // inside descendant components wont be invoked, so if we want to use it also inside
  // our LandingPage (index.js) for example, we need to get the data in this getInitialProps
  // and pass it down to the LandingPage component. We can access to the current component's getInitialProps
  // through our appContext.Component
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return {
    pageProps,
    currentUser: data.currentUser,
  };
};

export default AppComponent;
