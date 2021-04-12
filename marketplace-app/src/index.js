(function () {
  "use strict";

  const router = require("router");
  const appService = require("/module/server/appService");

  router.get("/", (req, res) => {
    res.render("/", {
      items: appService.getItems()
    });
  });

  router.get("/userItems", (req, res) => {
    renderUserItems(res);
  });

  router.get("/create", (req, res) => {
    res.render("/create", {
      contactInfo: appService.getContactInfo()
    });
  });

  router.post("/create", (req, res) => {
    if (appService.itemsLimitNotExceeded()) {
      const params = req.params;
      const file = req.file("file");
      appService.createItem(
        params.title,
        params.description,
        params.price,
        params.email,
        params.name,
        params.phoneNumber,
        file
      );
      renderUserItems(res);
    } else {
      res.render("/itemsLimitExceeded", {});
    }
  });

  router.get("/edit", (req, res) => {
    const itemId = req.params.id;
    if (appService.hasWriteAccess(itemId)) {
      res.render("/edit", {
        item: appService.getItem(itemId)
      });
    }
  });

  router.post("/edit", (req, res) => {
    const itemId = req.params.dsid;
    if (appService.hasWriteAccess(itemId)) {
      const params = req.params;
      appService.setItem(
        itemId,
        params.title,
        params.description,
        params.price,
        params.email,
        params.name,
        params.phoneNumber
      );
    }
    renderUserItems(res);
  });

  router.post("/remove", (req, res) => {
    const itemId = req.params.dsid;
    if (appService.hasWriteAccess(itemId)) {
      appService.removeItem(itemId);
    }
    renderUserItems(res);
  });

  router.post("/removeAll", (req, res) => {
    appService.removeUserItems();
    renderUserItems(res);
  });

  router.post("/report", (req, res) => {
    const mailSent = appService.sendMailToAdmin(
      req.params.subject,
      req.params.text
    );
    res.json({ mailSent: mailSent });
  });

  router.get("/upload/:id", (req, res) => {
    const itemId = req.params.id;
    res.render("/upload", {
      id: itemId
    });
  });

  router.post("/upload/:id", (req, res) => {
    const itemId = req.params.id;
    if (appService.hasWriteAccess(itemId)) {
      const file = req.file("file");
      appService.replaceImage(itemId, file);
    }
    renderUserItems(res);
  });

  function renderUserItems(res) {
    res.render("/userItems", {
      items: appService.getUserItems()
    });
  }
})();
