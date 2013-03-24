#!/usr/bin/env python
# -*- coding:utf-8 -*-

import webapp2, jinja2, os, json

from google.appengine.api import users
from database import create, read, update, delete
from database import mafCreate, mafRead
from database import retreatRead, retreatCreate, retreatUpdate
from gaelibs import locale


jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), 'app')),
    variable_start_string='{$',
    variable_end_string='$}')


class MainPage(webapp2.RequestHandler):
  def get(self):
    userLocale = locale.determineLocale(self.request.headers.get('accept_language'))
    langQ = json.dumps(locale.parseAcceptLanguage(self.request.headers.get('accept_language')))
    template_values = {
      'locale': '%s~%s' % (userLocale, langQ)
    }

    user = users.get_current_user()
    if user:
      # user already login
      template_values['isLogin'] = True
      template_values['userEmail'] = user.email()
      template_values['signoutURL'] = users.create_logout_url("/")
      if users.is_current_user_admin():
        template_values['isCurrentUserAdmin'] = True
      else:
        template_values['isCurrentUserAdmin'] = False
    else:
      # user not login
      template_values['isLogin'] = False
      template_values['isCurrentUserAdmin'] = False
      template_values['signinOrRegisterURL'] = users.create_login_url("/")

    template = jinja_environment.get_template('index.html')
    self.response.out.write(template.render(template_values))


class RESTfulHandler(webapp2.RequestHandler):
  def isLegalUser(self, email):
    user = users.get_current_user()
    if not user:
      self.abort(404)
    if email != user.email():
      self.abort(404)

  def isAdmin(self, email):
    if not users.is_current_user_admin():
      self.abort(404)

  def checkData(self, data):
    if (data):
      self.response.out.write(data)
    else:
      self.abort(404)

  def get(self, email):
    self.isLegalUser(email)
    if self.request.url.endswith('apply'):
      self.checkData(mafRead(email))
    elif self.request.url.endswith('retreat'):
      self.checkData(retreatRead(email))
    else:
      self.checkData(read(email))

  def post(self, email):
    self.isLegalUser(email)
    if self.request.url.endswith('apply'):
      self.checkData(mafCreate(email, self.request.body))
    elif self.request.url.endswith('retreat'):
      self.isAdmin(email)
      self.checkData(retreatCreate(self.request.body))
    else:
      self.checkData(create(email, self.request.body))

  def put(self, email):
    self.isLegalUser(email)
    if self.request.url.endswith(email):
      self.checkData(update(email, self.request.body))
    elif self.request.url.endswith('retreat'):
      self.isAdmin(email)
      self.checkData(retreatUpdate(self.request.body))
    else:
      self.abort(404)


  def delete(self, email):
    self.isLegalUser(email)
    if self.request.url.endswith(email):
      self.checkData(delete(email))
    else:
      self.abort(404)


class RedirectPage(webapp2.RequestHandler):
  def get(self, suffix):
    self.redirect('/')


app = webapp2.WSGIApplication([('/', MainPage),
                               ('/(userdata|apply|record|retreat|manageRetreats)', RedirectPage),
                               ('/RESTful/([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4})/apply', RESTfulHandler),
                               ('/RESTful/([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4})/retreat', RESTfulHandler),
                               ('/RESTful/([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4})', RESTfulHandler)],
                              debug=True)
