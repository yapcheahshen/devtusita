#!/usr/bin/env python
# -*- coding:utf-8 -*-

from google.appengine.ext import ndb
import json

class Person(ndb.Model):
  json = ndb.TextProperty()
  """
  email = ndb.StringProperty()
  name = ndb.StringProperty()
  birthday = ndb.DateProperty()
  citizenship = ndb.StringProperty()
  idNumber = ndb.StringProperty()
  gender = ndb.StringProperty()
  landline = ndb.StringProperty()
  cellphone = ndb.StringProperty()
  address = ndb.StringProperty()
  dhammaName = ndb.StringProperty()
  status = ndb.StringProperty()
  preceptorName = ndb.StringProperty()
  dateOrdination = ndb.StringProperty()
  placeOrdination = ndb.StringProperty()
  emgName = ndb.StringProperty()
  emgRelation = ndb.StringProperty()
  emgLandline = ndb.StringProperty()
  emgCellphone = ndb.StringProperty()
  emgAddress = ndb.StringProperty()
  notes = ndb.TextProperty()

  def toDict(self):
    # Python Dictionary (Dict) is equivalent to JavaScript object
    return { 'email': self.email,
             'name': self.name,
             'phone': self.phone,
             'address': self.address,
             'notes': self.notes }
  """


def create(email, jsonData):
  person = Person.get_by_id(email)
  if (person):
    # this entity already exists!
    return None
  """
  data = json.loads(jsonData)
  person = Person(id = email,
                  email = email,
                  name = data['name'],
                  phone = data['phone'],
                  address = data['address'],
                  notes = data['notes'])
  """
  person = Person(id = email,
                  json = jsonData)
  person.put()
  #return json.dumps(person.toDict())
  return person.json


def read(email):
  # use email as ID for database access
  person = Person.get_by_id(email)
  if (person):
    #return json.dumps(person.toDict())
    return person.json
  else:
    return None


def update(email, jsonData):
  person = Person.get_by_id(email)
  if (person):
    """
    data = json.loads(jsonData)
    person.name = data['name']
    person.phone = data['phone']
    person.address = data['address']
    person.notes = data['notes']
    person.put()
    """
    person.json = jsonData
    person.put()
    #return json.dumps(person.toDict())
    return person.json
  else:
    return None


def delete(email):
  person = Person.get_by_id(email)
  if (person):
    person.key.delete()
    return True
  else:
    return False
