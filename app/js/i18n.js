'use strict';

/* Wrap all i18n related filter, service, and directive together */
/**
 * There are two ways to do client localization:
 * (1) {{_("text_to_be_translated")}}
 *     - Cannot use because we use similar syntax on server side
 * (2) <element i18n locale="{{locale}}" str="text_to_be_translated">
 *     - "locale" attribute is optional, if no "locale" attribute
 *       then $rootScope.tusitaLocale is used.
 */


angular.module('tusita.i18n', []).

  factory('tusitaI18nSetting', ['$rootScope', function($rootScope) {
  // service: handle settings of i18n

    // built-in default, should be overwritten in config block of module
    var locale = 'en_US';

    var allowedLocales =  ['en_US', 'zh_TW', 'zh_CN'];

    return {
      setLocale: function(value) {
        var isAllowedLocale = false;

        angular.forEach(allowedLocales, function(locale) {
          if (value === locale) isAllowedLocale = true;
        });

        if (isAllowedLocale) {
          locale = value;
          $rootScope.tusitaLocale = value;
        }
      },

      getLocale: function() {return locale;}
    };
  }]).

  run(['$rootScope', 'i18nserv', function($rootScope, i18nserv) {
  // initialization code (similar to main)
    // FIXME: use angular.element or jQuery?
    // get value passed by server
    var locale = document.getElementById('locale').innerHTML;
    $rootScope.tusitaLocale = locale.split('~')[0];
    $rootScope.tusitaI18nLangQs = eval('(' + locale.split('~')[1] + ')');

    /**
     * for using {{_("i18n_string")}} at client side
     */
    $rootScope._ = function(str) {
      return i18nserv.gettext(str, $rootScope.tusitaLocale);
    };

    $rootScope.$watch('tusitaLocale', function(newValue, oldValue) {
      // FIXME: don't access document directly?
      document.title = i18nserv.gettext('Personal Page | Tusita Hermitage', newValue);
    });
  }]).

  filter('translate', [function() {
  // filter
    return function(text) {
      if (text === 'en_US') return 'English';
      if (text === 'zh_TW') return '中文 (繁體)';
      if (text === 'zh_CN') return '中文 (简体)';
      return text;
    }
  }]).

  factory('i18nserv', [function() {
  // service: for translating texts according to locale
    // FIXME: bad practice
    var i18nStr = tusitaLocales;

    // zh_CN derived from zh_TW by TongWen library
    i18nStr['zh_CN'] = (function() {
      if (angular.isUndefined(TongWen)) {
        console.log('no TongWen JS library!');
        return {};
      }
      var pairs = {};
      for (var key in i18nStr['zh_TW'])
        pairs[key] = TongWen.convert(i18nStr['zh_TW'][key], TongWen.flagSimp);
      return pairs;
    })();

    function gettext(value, locale) {
      if (i18nStr.hasOwnProperty(locale)) {
        if (i18nStr[locale].hasOwnProperty(value)) {
          if (i18nStr[locale][value] !== '' &&
              i18nStr[locale][value] !== null)
            return i18nStr[locale][value];
        }
      }
      return value;
    }

    return {
      gettext: gettext
    };
  }]).

  directive('i18n', ['i18nserv', '$rootScope', function(i18nserv, $rootScope) {
  // direcitive
    /**
     * wrap the string to be translated in ELEMENT 
     * with attribute 'i18n', 'str', and 'locale'(optional)
     * example: <ELEMENT i18n str='Home'>Home</ELEMENT>
     *      or  <ELEMENT i18n locale={{locale}} str='Home'>Home</ELEMENT>
     */
    return {
      restrict: 'A',
      link: function(scope, elm, attrs) {
        // if "locale" attribute exists, use it
        attrs.$observe('locale', function() {
          elm.html(i18nserv.gettext(attrs.str, attrs.locale));
        });

        // if there is no "locale" attribute, use $rootScope.tusitaLocale
        if (angular.isUndefined(attrs.locale)) {
          $rootScope.$watch('tusitaLocale', function() {
            elm.html(i18nserv.gettext(attrs.str, $rootScope.tusitaLocale));
          });
        }
      }
    };
  }]);
