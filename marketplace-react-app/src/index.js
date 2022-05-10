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
router.get("/userItems", (req, res) => {
  res.json(appService.getUserItems());
});

// Last tab endpoints
router.get("/contactInfo", (req, res) => {
  res.json(appService.getContactInfo());
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
    res.json({ error: '' });
  } else {
    res.json({ error: 'itemsLimitExceeded' });
  }
});

/*
// Route to collect last publish
router.get('/published', (req, res) => {
  // Fetch current page and the last publish timestamp
  const page = portletContextUtil.getCurrentPage();
  const timestamp = properties.get(page, 'lastPublishDate');

  // Format timestamp to human readable
  const date = timestampUtil.format(
     timestamp,
     'MMMMM yyyy HH:mm:ss',
     localeUtil.getLocaleByString('en')
  );

  // Send the date as JSON
  res.json({
     date,
  });
});*/