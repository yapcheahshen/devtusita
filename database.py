#!/usr/bin/env python
# -*- coding:utf-8 -*-

from google.appengine.ext import ndb

class Person(ndb.Model):
  email = ndb.StringProperty()
  name = ndb.StringProperty()
  phone = ndb.StringProperty()
  address = ndb.StringProperty()
  notes = ndb.TextProperty()

def storeData(email, name, phone, address, notes):
  person = Person(id = email,
                  email = email,
                  name = name,
                  phone = phone,
                  address = address,
                  notes = notes)
  person.put()

def readData(email):
  person = Person.get_by_id(email)
  if (person):
    data['email'] = person.email
    data['name'] = person.name
    data['phone'] = person.phone
    data['address'] = person.address
    data['notes'] = person.notes
    return data
  else:
    return None

def readAllData():
  persons = Person.query() # Retrieve all Person entitites

  dataArray = []
  for person in persons:
    dataArray.append({ 'email': person.email,
                       'name': person.name,
                       'phone': person.phone,
                       'address': person.address,
                       'notes': person.notes })

  return dataArray

def deleteData(email):
  person = Person.get_by_id(email)
  if (person):
    person.key.delete()

