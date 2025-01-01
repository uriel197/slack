const PARAM_REGEX = /:[A-Za-z0-9]+/;
const PARAM_REGEX_GLOBAL = /:[A-Za-z0-9]+/g;
class Router {
  constructor() {
    this._routes = {};
  }

  add = (urlTemplate, callback) => {
    this._routes[urlTemplate] = callback;
  };
  // underscore before the name indicates it is a private method
  _route = () => {
    const routes = Object.keys(this._routes);
    let routeToCall;
    for (const route of routes) {
      const regex = this._getRegex(route);
      const url = window.location.hash.slice(1, window.location.hash.length); // cuts out the "#" symbol
      const match = url.match(regex) || [];
      const paramNames = this._getParamNames(route);
      const params = this._getParams(match, paramNames);
      const resolvedRouteUrl = this._createUrl(route, match);
      if (url === resolvedRouteUrl) {
        routeToCall = { route, params };
        break;
      }
    }
    if (routeToCall) {
      const params = routeToCall.params;
      this._routes[routeToCall.route](params);
    } else if (window.location.hash === "" && this._routes["/"]) {
      this._routes["/"]({});
    }
  };

  _createUrl = (route, match) => {
    return match.slice(1, match.length).reduce((str, paramValue) => {
      return str.replace(PARAM_REGEX, paramValue);
    }, route);
  };

  _getRegex = (route) => {
    /* 1 */
    const str = route.replace(PARAM_REGEX_GLOBAL, "([A-Za-z0-9]+)");
    return new RegExp(str);
  };

  _getParamNames = (route) => {
    const match = route.match(PARAM_REGEX_GLOBAL) || [];
    return match.map((str) => str.slice(1, str.length));
  };

  _getParams = (match, paramNames) => {
    const paramValues = match.slice(1, match.length);
    return paramNames.reduce((params, name, index) => {
      params[name] = paramValues[index];
      return params;
    }, {});
  };

  listen = () => {
    window.addEventListener("hashchange", () => {
      this._route();
    });
    this._route();
  };
}

module.exports = Router;

/*
    ===================================
      COMMENTS - COMMENTS - COMMENTS
    ===================================

***1: Explanations/regex
_route()
Determines the current URL hash, matches it to a route, and calls the appropriate callback with parameters.
    
*/
