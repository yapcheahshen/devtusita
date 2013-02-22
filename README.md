Source Code for Personal Page of Tusita Hermitage
=========

The website is powered by [Google App Engine](https://developers.google.com/appengine/), [AngularJS](http://angularjs.org/), [Bootstrap](http://twitter.github.com/bootstrap/), and [Glyphicons Halflings](http://glyphicons.com/).

Development 
---------

* <i><b>app.yaml</b></i>, <i><b>main.py</b></i>, <i><b>database.py</b></i> : files on Google App Engine server(s). Written in Python programming language. These files route and handles user http requests.
* <i><b>app/\*</b></i> : files on client side, i.e., run on user browser. Use [AngularJS](http://angularjs.org/) to simplify development process.
  1. <i><b>app/index.html</b></i> : home page of the website. (The first page served when users visits the website)
  2. <i><b>app/css/\*</b></i> : css file(s) goes here.
  3. <i><b>app/js/\*</b></i> : JavaScript files goes here. (use [AngularJS](http://angularjs.org/))
  4. <i><b>app/img/\*</b></i> : image files goes here.
  5. <i><b>app/partials/\*</b></i> : partial html files used by [AngularJS](http://angularjs.org/).

## Database
Several models are used to store data on server. The first is:
### Person
```python
class Person(ndb.Model):
  json = ndb.TextProperty()
  activeMedAppForm = ndb.KeyProperty(repeated = True)
```
This is a model inherited from <i>[ndb.Model](https://developers.google.com/appengine/docs/python/ndb/modelclass)</i> to store basic information of users, such as name, birthday, and etc.
