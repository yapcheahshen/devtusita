#!/usr/bin/env python
# -*- coding:utf-8 -*-

import webapp2
import jinja2
import os

from google.appengine.api import users
from database import create, read, update, delete


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

  def get(self, email):
    if not self.isLegalUser(email):
      self.error(404)
      return

    data = read(email)
    if (data):
      self.response.out.write(data)
    else:
      self.error(404)

  def post(self, email):
    if not self.isLegalUser(email):
      self.error(404)
      return

    data = create(email, self.request.body)
    if data:
      self.response.out.write(data)
    else:
      self.error(404)

  def put(self, email):
    if not self.isLegalUser(email):
      self.error(404)
      return

    data = update(email, self.request.body)
    if data:
      self.response.out.write(data)
    else:
      self.error(404)

  def delete(self, email):
    if not self.isLegalUser(email):
      self.error(404)
      return

    data = delete(email)
    if data:
      self.response.out.write(data)
    else:
      self.error(404)


class RedirectPage(webapp2.RequestHandler):
  def get(self, suffix):
    self.redirect('/')


app = webapp2.WSGIApplication([('/', MainPage),
                               ('/(userdata|apply)', RedirectPage),
                               ('/RESTful/([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4})', RESTfulHandler)],
                              debug=True)
