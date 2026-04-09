import axios from "axios";
import { Express, Request, Response } from "express";
import config from "./config.json";
import mildlewares from "./midlwares";
import { DEFAULT_SERVICE_URL_MAP } from "./config";

const getServiceUrl = (urlEnv: string) => {
  const envValue = process.env[urlEnv]?.trim();
  return envValue || DEFAULT_SERVICE_URL_MAP[urlEnv] || "";
};

export const createHandler = (
  hostname: string,
  path: string,
  method: string
) => {
  return async (req: Request, res: Response) => {
    try {
      let url = `${hostname}${path}`;
      if (req.params) {
        Object.keys(req.params).forEach((param) => {
          const paramValue = req.params[param];
          const normalizedValue = Array.isArray(paramValue)
            ? paramValue[0] ?? ""
            : paramValue ?? "";
          url = url.replace(`:${param}`, normalizedValue);
        });
      }

      const { data } = await axios({
        method,
        url,
        data: method === "post" ? req.body : null,
        params: {},
        headers: {
          "x-user-id": req.headers["x-user-email"] || "",
          "x-user-email": req.headers["x-user-email"] || "",
          "x-user-name": req.headers["x-user-name"] || "",
          "x-user-role": req.headers["x-user-role"] || "",
          "user-agent": req.headers["user-agent"],
        },
      });

      res.json(data);
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        return res
          .status(error.response?.status || 500)
          .json(error.response?.data);
      }
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
};

const getMiddlewares = (names: string[]) => {
  return names.map((name) => mildlewares[name]);
};

export const configureRoutes = (app: Express) => {
  Object.entries(config.services).forEach(([_name, service]) => {
    const hostname = getServiceUrl(service.urlEnv);
    service.routes.forEach((route) => {
      route.methods.forEach((method) => {
        const endPoint = `/api${route.path}`;
        const handler = createHandler(hostname, route.path, method);
        const middleware = getMiddlewares(route.middlewares);
        app[method](endPoint, ...middleware, handler);
      });
    });
  });
};
