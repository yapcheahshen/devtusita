#!/usr/bin/env python
# -*- coding:utf-8 -*-

from google.appengine.ext import ndb
import json

class Person(ndb.Model):
  json = ndb.TextProperty()
  activeMedAppForm = ndb.KeyProperty(repeated = True)

class MedAppForm(ndb.Model):
  json = ndb.TextProperty()

class Retreat(ndb.Model):
  json = ndb.TextProperty()


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
    return None

  form = MedAppForm(json = jsonData,
                    parent = person.key)

  form.put()
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


def mafUpdate(email, jsonData):
  return


def mafDelete(email):
  return


def retreatCreate(jsonData):
  rt = Retreat(json = jsonData)
  rt.put()
  return rt.json


def retreatRead():
  pass
