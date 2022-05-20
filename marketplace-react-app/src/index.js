// Import needed utilities

// react
import * as React from 'react';
import { renderToString } from 'react-dom/server';

// router to set up routing
import router from '@sitevision/api/common/router';

// Component of the WebApp to render
import App from './components/App';

/* Public API utilities
import portletContextUtil from '@sitevision/api/server/PortletContextUtil';
import properties from '@sitevision/api/server/Properties';
import timestampUtil from '@sitevision/api/server/TimestampUtil';
import localeUtil from '@sitevision/api/server/LocaleUtil';*/


import appData from '@sitevision/api/server/appData';

import * as appService from './utils/appService';


router.get('/', (req, res) => {
  const name = appData.get('name');

  res.agnosticRender(renderToString(<App name={name} />), {
    name,
  });
});

// First tab endpoints
router.get("/items", (req, res) => {
  res.json(appService.getItems())
});

router.post("/report", (req, res) => {
  const mailSent = appService.sendMailToAdmin(
    req.params.subject,
    req.params.text
  );
  res.json({ mailSent: mailSent });
});

// Second tab endpoints
router.get("/user-items", (req, res) => {
  res.json(appService.getUserItems());
});

router.delete("/user-items/:id", (req, res) => {
  const itemId = req.params.id;
  if (appService.hasWriteAccess(itemId)) {
    appService.removeItem(itemId);
    res.json({ error: '' });
  } else {
    res.json({ error: 'Access denied' });
  }
});

router.delete("/user-items", (req, res) => {
  appService.removeUserItems();
  res.json({ error: '' });
});

// Last tab endpoints
router.get("/contact-info", (req, res) => {
  res.json(appService.getContactInfo());
});

router.post("/user-items", (req, res) => {
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
    res.json({ error: '' });
  } else {
    res.json({ error: 'itemsLimitExceeded' });
  }
});

router.put("/user-items/:id", (req, res) => {
  const itemId = req.params.id;
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
    )
    const file = req.file("file");
    if (file) {
      appService.replaceImage(itemId, file);
    }
    res.json({ error: '' });
  } else {
    res.json({ error: 'hasWriteAccess' });
  }
});