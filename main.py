#!/usr/bin/env python
# -*- coding:utf-8 -*-

import webapp2
import jinja2
import os, cgi

from google.appengine.api import users
from database import storeData, readData, readAllData, deleteData

jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), 'templates')))

class MainPage(webapp2.RequestHandler):
  def get(self):
    template_values = {
      'visitorEmail': users.get_current_user().email(),
    }

    template = jinja_environment.get_template('index.html')
    self.response.out.write(template.render(template_values))

class DBPage(webapp2.RequestHandler):
  def get(self):
    template_values = {
      'visitorEmail': users.get_current_user().email(),
      'currentPath': self.request.path,
    }

    if self.request.path == "/dbshow":
      template_values['dataArray'] = readAllData()

    template = jinja_environment.get_template('database.html')
    self.response.out.write(template.render(template_values))

  def post(self):
    if self.request.path == "/dbadd":
      email = cgi.escape(self.request.get('email'))
      name = cgi.escape(self.request.get('name'))
      phone = cgi.escape(self.request.get('phone'))
      address = cgi.escape(self.request.get('address'))
      notes = cgi.escape(self.request.get('notes'))
      storeData(email, name, phone, address, notes)
      self.redirect('/')

    if self.request.path == "/dbdelete":
      deleteData(cgi.escape(self.request.get('email')))
      self.redirect('/')


app = webapp2.WSGIApplication([('/', MainPage),
                               ('/dbshow', DBPage),
                               ('/dbadd', DBPage),
                               ('/dbdelete', DBPage)],
                              debug=True)
