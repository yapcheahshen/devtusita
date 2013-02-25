#!/usr/bin/env python
# -*- coding:utf-8 -*-


def parseAcceptLanguage(value):
  # array of (language, q) pairs
  pairs = []

  try:
    langQs = value.split(',')
  except:
    return pairs
  for langQ in langQs:
    if ';' in langQ:
      locale, q = langQ.split(';', 1)
      if '=' in q:
        q = q.split('=', 1)[1]
      pairs.append([locale.strip(), q.strip()])
    else:
      pairs.append([langQ.strip(), '1'])

  return pairs


def determineLocale(value):
  try:
    pairs = parseAcceptLanguage(value)

    for pair in pairs:
      lang = pair[0].lower()
      if lang == 'zh-tw':
        return 'zh_TW'
      if lang == 'zh-hk':
        return 'zh_TW'
      if lang == 'zh-cn':
        return 'zh_CN'
      if lang.startswith('zh'):
        return 'zh_CN'
      if lang.startswith('en'):
        return 'en_US'

  except:
    return 'en_US'

  return 'en_US'


