Source Code for Personal Page of Tusita Hermitage
=========

The website is powered by [Google App Engine](https://developers.google.com/appengine/), [AngularJS](http://angularjs.org/), [Bootstrap](http://twitter.github.com/bootstrap/), and [Glyphicons Halflings](http://glyphicons.com/).

## 系統設計

登入前:
僅看得到Welcome及News.

登入後(僅限Google帳號登入):
瀏覽器從伺服器讀取該帳號基本資料(註1),若:
  * 1) 讀不到的到基本資料(第一次登入):強制導到填寫基本資料畫面,若不填寫則無法進入其他畫面,填寫後瀏覽器會把基本資料存到伺服器(註2)
  * 2) 讀得到的到基本資料:系統管理者會看到六個頁面,登入使用者則會看到四個頁面:
    * (一)更新我的資料(登入使用者皆可看到): 在此可修改基本資料,修改後瀏覽器會把修改的資料存到伺服器.(註3)
    * (二)禪修申請(登入使用者皆可看到): 點選此頁面,瀏覽器會從伺服器讀取目前所有的禪修期,顯示在申請表上給使用者選擇,等使用者填好後,把使用者申請資料存到伺服器(註4)
    * (三)禪修申請記錄(登入使用者皆可看到): 顯示使用者所有的禪修申請紀錄(註5)
    * (四)新增禪修期(僅系統管理者可看到): 系統管理員可新增禪修期讓使用者在禪修申請頁面選擇.(註6)
    * (五)管理禪修期(僅系統管理者可看到): 瀏覽器會從伺服器讀取所有的禪修期並顯示出來,系統管理員可選擇其中一個禪修期並修改之,修改後會把此修改存回伺服器.(註7)
    * (六)首頁(登入使用者皆可看到): 顯示Welcome及News.

為了簡化開發及維護,禪師必須加為系統管理者才可新增及管理禪修期.

附註:

註1:透過RESTful api(網址: <strong>/RESTful/{{email}}</strong>, 舉例來說,若使用者登入時的email是<em>example@gmail.com</em>, 則為<strong>/RESTful/example@gmail.com</strong>)讀取基本資料(讀取<em>Person</em> model)

註2:資料打包成json透過RESTful api ( 網址: <strong>/RESTful/{{email}}</strong> ) 傳到server存起來.(存到<em>Person</em> model)

註3:資料打包成json透過RESTful api ( 網址: <strong>/RESTful/{{email}}</strong> ) 傳到server存起來.(存到<em>Person</em> model)

註4:瀏覽器會先透過RESTful api( 網址: <strong>/RESTful/{{email}}/retreat</strong> )讀取所有的禪修期(讀取<em>Retreat</em> model),並顯示在申請表單上給申請者選擇,申請者填寫送出後將資料打包成json透過RESTful api( 網址: <strong>/RESTful/{{email}}/apply</strong> )傳到server存起來(存到<em>MedAppForm</em> model), server會同時更新<em>Person</em> model,將此<em>MedAppForm</em> model entity的key附加在該使用者<em>Person</em> model entity的activeMedAppForm欄位,這樣做是為了之後server可以讀取該使用者的所有禪修申請.

註5:透過RESTful api( 網址: <strong>/RESTful/{{email}}/apply</strong> )讀取該使用者的所有申請資料.(先讀取<em>Person</em> model的activeMedAppForm欄位裡的key(s),再從key(s)讀取<em>MedAppForm</em> model)

註6:填寫送出後,資料打包成json透過RESTful api( 網址: <strong>/RESTful/{{email}}/retreat</strong> )傳到server存起來.(存到<em>Retreat</em> model)

註7:透過RESTful api( 網址: <strong>/RESTful/{{email}}/retreat</strong> )讀取所有禪修期資料(讀取<em>Retreat</em> model),系統管理者修改其中一個禪修期後,再透過同一個api存起來.

## Setup of Development Environment

<i>REPO_DIR</i> below means the directory where you git clone this repository. <i>GAE_PYSDK_DIR</i> means the directory of [Google App Engine Python SDK](https://developers.google.com/appengine/downloads#Google_App_Engine_SDK_for_Python).

* Create i18n files for production use:
```bash
    cd REPO_DIR/pytools/
    # create i18n files
    python i18nUtils.py pot
    python i18nUtils.py po

    # create JavaScript file ( REPO_DIR/app/js/locales.js ) of translated strings for client side
    python i18nUtils.py js
```
<strong>FIXME</strong>: how to use msg tools on Windows system?

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

