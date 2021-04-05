const nodeIteratorUtil = require('NodeIteratorUtil'),
    nodeComparatorUtil = require('NodeComparatorUtil'),   
    linkRenderer = require('LinkRenderer'),
    textRendererBuilder = require('TextModuleRendererBuilder'),
    utils = require('Utils'),
    propertyUtil = require('PropertyUtil'),
    imageRenderer = require('ImageRenderer'),
    outputUtil = require('OutputUtil');

const Collections = Packages.java.util.Collections;
const IllegalArgumentException = Packages.java.lang.IllegalArgumentException;

const NEWS = scriptVariables.news;
const MAX_NUMBER_OF_NEWS = scriptVariables.maxNumberOfNews;
const DEBUG = scriptVariables.debug;

if (!NEWS) 
   throw new IllegalArgumentException('Ogiltigt värde på variabeln för arkiv');

if (MAX_NUMBER_OF_NEWS < 1) 
   throw new IllegalArgumentException('Ogiltigt värde på variabeln för max antal nyheter (Måste vara ett heltal större än 0)');


const menuItems = nodeIteratorUtil.getMenuItems(NEWS);
const menuItemsList = nodeIteratorUtil.toList(menuItems);
const comparator = nodeComparatorUtil.getPropertyComparator('lastPublishDate');
const reversedComparator = nodeComparatorUtil.getReversedComparator(comparator);

Collections.sort(menuItemsList, reversedComparator);
const limitedArticles = menuItemsList.toArray().slice(0, MAX_NUMBER_OF_NEWS);

const articles = limitedArticles.map(article => {

   const title = propertyUtil.getString(article, 'SV.Title'); 
   const description = propertyUtil.getString(article, 'SV.Description');      
   const content = propertyUtil.getString(article, 'SV.Content');
   const image = propertyUtil.getNode(article, 'SV.Image');

   linkRenderer.update(article, 'normal', title);
   const imageScaler = utils.getImageScaler(400, 400);
   imageRenderer.setImageScaler(imageScaler);
   imageRenderer.clearSourceSetMode();
   imageRenderer.update(image);
   imageRenderer.forceUseImageScaler();

   const obj = {
      title: linkRenderer.render(),
      description: description.substring(0, 100) + (description.length > 100 ? '...' : ''),
      content: content.substring(0, 300) + (content.length > 300 ? '...' : ''),
      image: imageRenderer.render()
   };
   
   if (DEBUG) 
      obj.debug = outputUtil.getNodeInfoAsHTML(article);
   
   return obj;
});



