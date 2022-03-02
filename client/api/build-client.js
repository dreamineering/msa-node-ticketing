import axios from "axios";

const buildClient = ({ req }) => {
  if (req) {
    // SERVICE.NAMESPACE.svc.cluster.local
    // kubectl get services -n ingress-nginx
    // kubectl get namespace
    // "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
    return axios.create({
      baseURL: "http://unfamoustours.com",
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
