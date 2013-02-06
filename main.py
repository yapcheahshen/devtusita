#!/usr/bin/env python
# -*- coding:utf-8 -*-

import webapp2
import jinja2
import os

from google.appengine.api import users
from database import create, read, update, delete, mafCreate, mafRead, mafUpdate, mafDelete


jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), 'templates')),
    variable_start_string='{$',
    variable_end_string='$}')


class MainPage(webapp2.RequestHandler):
  def get(self):
    template_values = {}

    user = users.get_current_user()
    if user:
      template_values['isLogin'] = True
      template_values['userEmail'] = user.email()
      template_values['signoutURL'] = users.create_logout_url("/")
    else:
      template_values['isLogin'] = False
      template_values['signinOrRegisterURL'] = users.create_login_url("/")

    template = jinja_environment.get_template('index.html')
    self.response.out.write(template.render(template_values))


class RESTfulHandler(webapp2.RequestHandler):
  def isLegalUser(self, email):
    user = users.get_current_user()
    if not user:
      return False
    if email != user.email():
      return False
    return True

  def checkData(self, data):
    if (data):
      self.response.out.write(data)
    else:
      self.error(404)

  def get(self, email):
    if not self.isLegalUser(email):
      self.error(404)
      return

    if self.request.url.endswith('apply'):
      data = mafRead(email)
    else:
      data = read(email)
    self.checkData(data)

  def post(self, email):
    if not self.isLegalUser(email):
      self.error(404)
      return

    if self.request.url.endswith('apply'):
      data = mafCreate(email, self.request.body)
    else:
      data = create(email, self.request.body)
    self.checkData(data)

  def put(self, email):
    if not self.isLegalUser(email):
      self.error(404)
      return

    if self.request.url.endswith('apply'):
      data = mafUpdate(email, self.request.body)
    else:
      data = update(email, self.request.body)
    self.checkData(data)

  def delete(self, email):
    if not self.isLegalUser(email):
      self.error(404)
      return

    if self.request.url.endswith('apply'):
      data = mafDelete(email)
    else:
      data = delete(email)
    self.checkData(data)


class RedirectPage(webapp2.RequestHandler):
  def get(self, suffix):
    self.redirect('/')


app = webapp2.WSGIApplication([('/', MainPage),
                               ('/(userdata|apply|record)', RedirectPage),
                               ('/RESTful/([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4})/apply', RESTfulHandler),
                               ('/RESTful/([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4})', RESTfulHandler)],
                              debug=True)
