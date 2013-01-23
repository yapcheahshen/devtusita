#!/usr/bin/env python
# -*- coding:utf-8 -*-

import webapp2
import jinja2
import os, json

from google.appengine.api import users
from google.appengine.ext import ndb

jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), 'templates')))

class Person(ndb.Model):
  email = ndb.StringProperty()
  name = ndb.StringProperty()
  phone = ndb.StringProperty()
  address = ndb.StringProperty()
  notes = ndb.TextProperty()

  def toDict(self):
    # Python Dictionary (Dict) is equivalent to JavaScript object
    return { 'email': self.email,
             'name': self.name,
             'phone': self.phone,
             'address': self.address,
             'notes': self.notes }
 

class MainPage(webapp2.RequestHandler):
  def get(self):
    template_values = {
      'visitorEmail': users.get_current_user().email(),
      'signoutURL': users.create_logout_url("/"),
    }

    template = jinja_environment.get_template('index.html')
    self.response.out.write(template.render(template_values))


class RESTfulHandler(webapp2.RequestHandler):
  def get(self, email):
    if email != users.get_current_user().email():
      self.error(403)
      return
    # use email as ID for database access
    person = Person.get_by_id(users.get_current_user().email())
    if (person):
      self.response.out.write(json.dumps(person.toDict()))
    else:
      self.error(404)

  def post(self, email):
    if email != users.get_current_user().email():
      self.error(403)
      return
    person = Person.get_by_id(users.get_current_user().email())
    if (person):
      # this entity already exists!
      self.error(403)
      return
    data = json.loads(self.request.body)
    person = Person(id = users.get_current_user().email(),
                    email = users.get_current_user().email(),
                    name = data['name'],
                    phone = data['phone'],
                    address = data['address'],
                    notes = data['notes'])
    person.put()
    self.response.out.write(json.dumps(person.toDict()))

  def put(self, email):
    if email != users.get_current_user().email():
      self.error(403)
      return
    person = Person.get_by_id(users.get_current_user().email())
    data = json.loads(self.request.body)
    person.name = data['name']
    person.phone = data['phone']
    person.address = data['address']
    person.notes = data['notes']
    person.put()
    self.response.out.write(json.dumps(person.toDict()))

  def delete(self, email):
    if email != users.get_current_user().email():
      self.error(403)
      return
    person = Person.get_by_id(users.get_current_user().email())
    if (person):
      person.key.delete()
    else:
      self.error(403)


app = webapp2.WSGIApplication([('/', MainPage),
                               ('/RESTful/([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4})', RESTfulHandler)],
                              debug=True)
