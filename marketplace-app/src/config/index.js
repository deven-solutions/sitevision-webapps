(function () {
  const router = require("router");
  const portletContextUtil = require("PortletContextUtil");
  const properties = require("Properties");
  const appInfo = require("appInfo");

  router.get("/", (req, res) => {
    const currentUserEmail = properties.get(
      portletContextUtil.getCurrentUser(),
      "mail"
    );
    const appName = appInfo.appName;

    res.render({
      currentUserEmail: currentUserEmail,
      appName: appName.toLowerCase(),
    });
  });
})();
