import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // we are on the server. We create an INSTANCE of axios
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.kube-system.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    // We are on the browser. We create an INSTANCE of axios
    return axios.create({
      baseURL: '/',
    });
  }
};
