<a href="https://github.com/ialex90/easy-deploy-extension/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/ialex90/easy-deploy-extension.svg"/>
  </a>

  <a href="https://twitter.com/alora90">
    <img src="https://img.shields.io/badge/say-thanks-ff69b4.svg"/>
  </a>
  
<a href="https://angular.io">
  <img src="https://img.shields.io/badge/Made%20with-Angular-E13137.svg"/>
</a>

# Easy Deploy - Chrome Extension

This is a chrome extension that allows you to manually trigger a GitHub Action.

### How to run locally

1. Clone this repository and install dependencies using `npm install` inside the cloned folder
2. Run the local development server using `npm start` _(watch mode enabled)_
3. Open a new chrome tab with the following URL: <chrome://extensions/>
4. Enable developer mode and click **LOAD UNPACKED**

  ![Screenshot from documentation](https://developer.chrome.com/static/images/get_started/load_extension.png "Screenshot from documentation")
  
  [Chrome documentation and image source](https://developer.chrome.com/extensions/getstarted#manifest)

5. Select the `dist/` folder
6. Open GitHub.com page and navigate to your repository, click on the extension to see the popup working

Note: Keep in mind when developing locally, neither `background.ts` nor `contentScript.ts` are being updated dynamically. You have to manually update the extension content from the Chrome extension's page.


### Contributions [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/ialex90/easy-deploy/issues)

You are welcome to contribute to this project.
All suggestions/fixes/help are more than welcome. Add your feedback to [this todo list](https://github.com/ialex90/easy-deploy-extension/issues/1) for feature requests

Please contact me ([@alora90](https://twitter.com/alora90)) if you need some help getting started with the setup
