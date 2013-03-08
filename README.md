Source Code for Personal Page of Tusita Hermitage
=========

The website is powered by [Google App Engine](https://developers.google.com/appengine/), [AngularJS](http://angularjs.org/), [Bootstrap](http://twitter.github.com/bootstrap/), and [Glyphicons Halflings](http://glyphicons.com/).

## Setup of Development Environment

<i>REPO_DIR</i> below means the directory where you git clone this repository. <i>GAE_PYSDK_DIR</i> means the directory of [Google App Engine Python SDK](https://developers.google.com/appengine/downloads#Google_App_Engine_SDK_for_Python).

Download JavaScript library ([1](http://tongwen.openfoundry.org/src/web/tongwen_core.js), [2](http://tongwen.openfoundry.org/src/web/tongwen_table_s2t.js), [3](http://tongwen.openfoundry.org/src/web/tongwen_table_t2s.js), [4](http://tongwen.openfoundry.org/src/web/tongwen_table_ps2t.js), [5](http://tongwen.openfoundry.org/src/web/tongwen_table_pt2s.js)) for conversion between Traditional and Simplified Chinese from [New Tong Wen Tang](http://tongwen.openfoundry.org/). Put under <i>REPO_DIR/app/js/ext/</i>.
```bash
    mkdir -p REPO_DIR/app/js/ext/
    cd REPO_DIR/app/js/ext/
    wget http://tongwen.openfoundry.org/src/web/tongwen_core.js
    wget http://tongwen.openfoundry.org/src/web/tongwen_table_s2t.js
    wget http://tongwen.openfoundry.org/src/web/tongwen_table_t2s.js
    wget http://tongwen.openfoundry.org/src/web/tongwen_table_ps2t.js
    wget http://tongwen.openfoundry.org/src/web/tongwen_table_pt2s.js
```

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
This is a model inherited from <i>[ndb.Model](https://developers.google.com/appengine/docs/python/ndb/modelclass)</i> to store basic information of users, such as name, birthday, and etc. There are two properties in this <b>Person</b> model, <i>json</i> and <i>activeMedAppForm</i>. The field <i>json</i> stores user information in JSON format, and the field <i>activeMedAppForm</i> stores key(s) of user meditation application(s). The data of user meditation application is stored in another model called <i>MedAppForm</i>, which will be described next.

### MedAppForm
```python
class MedAppForm(ndb.Model):
  json = ndb.TextProperty()
  retreat = ndb.KeyProperty()
```
This model stores the user meditation application. The field <i>json</i> stores the form data in JSON format, and the field <i>retreat</i> stores the retreat that meditators apply for.

### Retreat
```python
class Retreat(ndb.Model):
  json = ndb.TextProperty()
  startDate = ndb.DateProperty()
```
This model stores the retreat data that created by system adminstrators. The field <i>json</i> stores the retreat data (such as start_date and end_date) in json format, and the field <i>startDate</i> stores the beginning date of the retreat in Python [date](http://docs.python.org/2/library/datetime.html) format.

## RESTful API
The are repective API for each model:
### RESTful API for Person
CRUD (create, read, update, and delete) are all supported. The url for communication is <b>/RESTful/{{email}}</b>, where {{email}} is the email address of the user.

### RESTful API for MedAppForm
Only <i>create</i> and <i>read</i> are supported. The url is <b>/RESTful/{{email}}/apply</b>, where {{email}} is the email address of the user. The read operation will return all applied form(s) back to client.

### RESTful API for Retreat
<i>create</i>, <i>read</i>, <i>update</i> are supported. The url is <b>/RESTful/{{email}}/retreat</b>, where {{email}} is the email address of the user. The read operation will return all retreats back to client.

