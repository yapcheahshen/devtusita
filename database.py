#!/usr/bin/env python
# -*- coding:utf-8 -*-

from google.appengine.ext import ndb
import json, datetime

class Person(ndb.Model):
  json = ndb.TextProperty()
  activeMedAppForm = ndb.KeyProperty(repeated = True)

class MedAppForm(ndb.Model):
  json = ndb.TextProperty()
  retreat = ndb.KeyProperty()

class Retreat(ndb.Model):
  json = ndb.TextProperty()
  startDate = ndb.DateProperty()


def create(email, jsonData):
  person = Person.get_by_id(email)
  if (person):
    # this entity already exists!
    return None
  person = Person(id = email,
                  json = jsonData)
  person.put()
  return person.json


def read(email):
  # use email as ID for database access
  person = Person.get_by_id(email)
  if (person):
    return person.json
  else:
    return None


def update(email, jsonData):
  person = Person.get_by_id(email)
  if (person):
    person.json = jsonData
    person.put()
    return person.json
  else:
    return None


def delete(email):
  person = Person.get_by_id(email)
  if (person):
    for form in person.activeMedAppForm:
      form.delete()
    person.key.delete()
    return True
  else:
    return False


def mafCreate(email, jsonData):
  person = Person.get_by_id(email)
  if person == None:
    return

  try:
    form = MedAppForm(json = jsonData,
                      retreat = ndb.Key(urlsafe = json.loads(jsonData)['retreat']),
                      parent = person.key)
  except:
    form = MedAppForm(json = jsonData,
                      parent = person.key)
  form.put()

  # append this meditaion application form to user basic
  if person.activeMedAppForm:
    person.activeMedAppForm.append(form.key)
  else:
    person.activeMedAppForm = [form.key]
  person.put()

  return form.json


def mafRead(email):
  person = Person.get_by_id(email)
  if person == None:
    return None

  if (person.activeMedAppForm):
    forms = []
    for key in person.activeMedAppForm:
      form = json.loads(key.get().json)
      form['urlsafe'] = key.urlsafe()
      forms.append(form)
    return json.dumps(forms)
  else:
    return None


def retreatCreate(jsonData):
  # extract start date of retreat
  try:
    retreatObj = json.loads(jsonData)
    # startDateStr example: 2013-02-22
    startDateStr = retreatObj['startDate']
    # array = [year, month, day]
    array = startDateStr.split('-')
    # from Python doc: class datetime.date(year, month, day)
    startDate = datetime.date(int(array[0]), int(array[1]), int(array[2]))
  except:
    return

  rt = Retreat(json = jsonData, startDate = startDate)
  rt.put()
  return rt.json


def retreatRead(email):
  # return all retreats
  retreats = Retreat.query()

  result = []
  for retreat in retreats:
    obj = json.loads(retreat.json)
    obj['urlsafe'] = retreat.key.urlsafe()
    result.append(obj)

  return json.dumps(result)


def retreatUpdate(jsonData):
  # extract start date of retreat
  try:
    retreatObj = json.loads(jsonData)
    # startDateStr example: 2013-02-22
    startDateStr = retreatObj['startDate']
    # array = [year, month, day]
    array = startDateStr.split('-')
    # from Python doc: class datetime.date(year, month, day)
    startDate = datetime.date(int(array[0]), int(array[1]), int(array[2]))

    rt = ndb.Key(urlsafe = retreatObj['urlsafe'])
    rt.json = jsonData
    rt.startDate = startDate
  except:
    return

  rt.put()
  return rt.json

