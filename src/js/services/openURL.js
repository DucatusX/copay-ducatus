'use strict';

angular.module('copayApp.services').factory('openURLService', function($rootScope, $ionicHistory, $document, $log, $state, platformInfo, lodash, profileService, incomingData, appConfigService) {
  var root = {};

  var handleOpenURL = function(args) {

    $log.info('Handling Open URL: ' + JSON.stringify(args));
    // Stop it from caching the first view as one to return when the app opens
    $ionicHistory.nextViewOptions({
      historyRoot: true,
      disableBack: false,
      disableAnimation: true
    });

    var url = args.url;
    if (!url) {
      $log.error('No url provided');
      return;
    };

    if (url) {
      if ('cordova' in window) {
        window.cordova.removeDocumentEventHandler('handleopenurl');
        window.cordova.addStickyDocumentEventHandler('handleopenurl');
      }
      document.removeEventListener('handleopenurl', handleOpenURL);
    }

    document.addEventListener('handleopenurl', handleOpenURL, false);

    if (!incomingData.redir(url)) {
      $log.warn('Unknown URL! : ' + url);
    }
  };

  var handleResume = function() {
    $log.debug('Handle Resume @ openURL...');
    document.addEventListener('handleopenurl', handleOpenURL, false);
  };

  root.init = function() {
    $log.debug('Initializing openURL');
    document.addEventListener('handleopenurl', handleOpenURL, false);
    document.addEventListener('resume', handleResume, false);

    if (platformInfo.isChromeApp) {
      $log.debug('Registering Chrome message listener');
      chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
          if (request.url) {
            handleOpenURL(request.url);
          }
        });
    } else if (platformInfo.isNW) {
      var gui = require('nw.gui');

      // This event is sent to an existent instance of Copay (only for standalone apps)
      gui.App.on('open', function(pathData) {
<<<<<<< HEAD
        if (pathData.indexOf('ducatuscoin:') != -1) {
<<<<<<< HEAD
          $log.debug('Ducatuscoin URL found');
=======
          $log.debug('DucatusCoin URL found');
>>>>>>> 53ccad1a9a2a308ca50609c38d50eb28f16af81c
=======
        if (pathData.indexOf('ducatuscoin:') != -1) {
          $log.debug('Ducatuscoin URL found');
>>>>>>> parent of fc2811a... Added changes in names
          handleOpenURL({
            url: pathData.substring(pathData.indexOf('ducatuscoin:'))
          });
        } else if (pathData.indexOf(appConfigService.name + '://') != -1) {
          $log.debug(appConfigService.name + ' URL found');
          handleOpenURL({
            url: pathData.substring(pathData.indexOf(appConfigService.name + '://'))
          });
        }
      });

      // Used at the startup of Copay
      var argv = gui.App.argv;
      if (argv && argv[0]) {
        handleOpenURL({
          url: argv[0]
        });
      }
    } else if (platformInfo.isDevel) {
      var base = window.location.origin + '/';
      var url = base + '#/uri/%s';

      if (navigator.registerProtocolHandler) {
        $log.debug('Registering Browser handlers base:' + base);
<<<<<<< HEAD
<<<<<<< HEAD
        navigator.registerProtocolHandler('ducatuscoin', url, 'Copay Ducatuscoin Handler');
=======
        navigator.registerProtocolHandler('ducatuscoin', url, 'Copay DucatusCoin Handler');
>>>>>>> 53ccad1a9a2a308ca50609c38d50eb28f16af81c
=======
        navigator.registerProtocolHandler('ducatuscoin', url, 'Copay Ducatuscoin Handler');
>>>>>>> parent of fc2811a... Added changes in names
        navigator.registerProtocolHandler('web+copay', url, 'Copay Wallet Handler');
        navigator.registerProtocolHandler('web+bitpay', url, 'BitPay Wallet Handler');
      }
    }
  };

  root.registerHandler = function(x) {
    $log.debug('Registering URL Handler: ' + x.name);
    root.registeredUriHandlers.push(x);
  };

  root.handleURL = function(args) {
    profileService.whenAvailable(function() {
      // Wait ux to settle
      setTimeout(function() {
        handleOpenURL(args);
      }, 1000);
    });
  };

  return root;
});
