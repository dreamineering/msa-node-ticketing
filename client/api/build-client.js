import axios from "axios";

const buildClient = ({ req }) => {
  if (req) {
    // SERVICE.NAMESPACE.svc.cluster.local
    // kubectl get services -n ingress-nginx
    // kubectl get namespace
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    // we are in the browser
    // kubernetes requests can be made with a base url of ''
    return axios.create({
      baseURL: "/",
    });
  }
};

export default buildClient;
