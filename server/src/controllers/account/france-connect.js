const querystring = require("querystring");

const httpClient = require("../../utils/httpClient");
const config = require("../../utils/config");
const getAuthorizationUrlForAuthentication = require("../../utils/utils")
  .getAuthorizationUrlForAuthentication;
const getLogoutUrl = require("../../utils/utils").getLogoutUrl;
const getAcrFromIdToken = require("../../utils/utils").getAcrFromIdToken;

function FClogin(req, res) {
  res.redirect(getAuthorizationUrlForAuthentication(req.body.eidasLevel));
}

function FClogout(req, res) {
  res.redirect(getLogoutUrl(req.session.idToken));
}

/**
 * Init FranceConnect authentication login process.
 * Make every http call to the different API endpoints.
 */
const oauthLoginCallback = async (req, res, next) => {
  // check if the mandatory Authorization code is there
  if (!req.query.code) {
    return res.sendStatus(400);
  }
  try {
    // Set request params
    const body = {
      grant_type: "authorization_code",
      redirect_uri: `${config.FS_URL}${config.LOGIN_CALLBACK_FS_PATH}`,
      client_id: config.AUTHENTICATION_CLIENT_ID,
      client_secret: config.AUTHENTICATION_CLIENT_SECRET,
      code: req.query.code,
    };

    // Request access token.
    const {
      data: { access_token: accessToken, id_token: idToken },
    } = await httpClient({
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: querystring.stringify(body),
      url: `${config.FC_URL}${config.TOKEN_FC_PATH}`,
    });

    if (!accessToken || !idToken) {
      return res.sendStatus(401);
    }

    // Request user data
    const { data: user } = await httpClient({
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
      url: `${config.FC_URL}${config.USERINFO_FC_PATH}`,
    });

    // Store the user in session so it is available for future requests
    // as the idToken for Logout, and the context
    req.session.user = user;
    req.session.context = { acr: getAcrFromIdToken(idToken) };
    req.session.idToken = idToken;

    return res.redirect("/user");
  } catch (error) {
    return next(error);
  }
};

const getUser = (req, res) => {};

const oauthLogoutCallback = (req, res) => {
  // Empty session
  req.session.destroy();

  return res.redirect("/");
};

exports.FClogin = FClogin;
exports.FClogout = FClogout;
exports.oauthLoginCallback = oauthLoginCallback;
exports.getUser = getUser;
exports.oauthLogoutCallback = oauthLogoutCallback;
