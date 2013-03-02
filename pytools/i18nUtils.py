#!/usr/bin/env python
# -*- coding:utf-8 -*-

# References
# https://developers.google.com/edu/python/regular-expressions
# http://stackoverflow.com/questions/490597/regex-replace-in-python-a-more-simple-way
# http://stackoverflow.com/questions/279237/python-import-a-module-from-a-folder
# http://wiki.maemo.org/Internationalize_a_Python_application
# http://www.supernifty.org/blog/2011/09/16/python-localization-made-easy/

import os, sys, re, json, shutil

# global variable
locale_dir = os.path.join(os.path.dirname(__file__), '../locale')
html_dir = os.path.join(os.path.dirname(__file__), '../app')
potpath = os.path.join(locale_dir, 'messages.pot')
twPoPath = os.path.join(locale_dir, 'zh_TW/LC_MESSAGES/messages.po')
dstLocalesJs = os.path.join(os.path.dirname(__file__), '../app/js/locales.js') 
locales = ['zh_TW']


def createPOT():
  if not os.path.exists(locale_dir):
    os.makedirs(locale_dir)

  # The default locale dir of webapp2 i18n is $PROJECT_DIR/locale
  # The default domain of webapp2 i18n is 'messages'
  # see http://webapp-improved.appspot.com/api/webapp2_extras/i18n.html#webapp2_extras.i18n.default_config
  #cmd_xgettext = 'xgettext --from-code=UTF-8 --keyword=_ --output=%s/messages.pot `find %s -name *.html`' % (locale_dir, html_dir)
  cmd_xgettext = 'xgettext --no-wrap --from-code=UTF-8 --keyword=_ --output=%s/messages.pot `find %s -name *.html`' % (locale_dir, html_dir)
  cmd_sed = 'sed -i "s/charset=CHARSET/charset=utf-8/g" %s/messages.pot' % locale_dir

  print(cmd_xgettext)
  os.system(cmd_xgettext)
  print(cmd_sed)
  os.system(cmd_sed)


def initLocalePO(locale):
  popath = os.path.join(locale_dir, '%s/LC_MESSAGES/messages.po' % locale)

  if not os.path.exists(os.path.dirname(popath)):
    os.makedirs(os.path.dirname(popath))
  cmd_msginit = 'msginit --no-translator --input=%s --locale=%s -o %s' % (potpath, locale, popath)
  print(cmd_msginit)
  os.system(cmd_msginit)


def initPOs():
  for locale in locales:
    initLocalePO(locale)


def updateLocalePO(locale):
  popath = os.path.join(locale_dir, '%s/LC_MESSAGES/messages.po' % locale)

  if not os.path.exists(os.path.dirname(popath)):
    os.makedirs(os.path.dirname(popath))
  cmd_msginit = 'msgmerge --no-wrap --backup=none --update %s %s' % (popath, potpath)
  print(cmd_msginit)
  os.system(cmd_msginit)


def updatePOs():
  for locale in locales:
    updateLocalePO(locale)


def initOrUpdatePOs():
  for locale in locales:
    popath = os.path.join(locale_dir, '%s/LC_MESSAGES/messages.po' % locale)
    if os.path.exists(popath):
      updateLocalePO(locale)
    else:
      initLocalePO(locale)


def writeJs():
  # create PO-like js file for i18n
  with open(twPoPath, 'r') as f:
    tuples = re.findall(r'msgid "(.+)"\nmsgstr "(.+)"', f.read())

  obj = {'zh_TW': {}}
  for tuple in tuples:
    obj['zh_TW'][tuple[0].decode('utf-8')] = tuple[1].decode('utf-8')

  with open(dstLocalesJs, 'w') as f:
    f.write('var tusitaLocales = ')
    f.write(json.dumps(obj))
    f.write(';')

  print(json.dumps(obj))


if __name__ == '__main__':
  if len(sys.argv) != 2:
    sys.exit(1)

  if sys.argv[1] == "pot":
    createPOT()
    sys.exit(0)

  if sys.argv[1] == "initpo":
    initPOs()
    sys.exit(0)

  if sys.argv[1] == "updatepo":
    updatePOs()
    sys.exit(0)

  if sys.argv[1] == "po":
    initOrUpdatePOs()
    sys.exit(0)

  if sys.argv[1] == "js":
    writeJs()
    sys.exit(0)

