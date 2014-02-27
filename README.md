# Departr

Departr is a smart and fast startpage to help you reach other web sites.

# Demo

It's up and running here http://departr.solt.biz/

Anyway, it's look like that :
![Screenshot](https://github.com/florentsolt/departr/raw/master/screenshot.jpg)

# How to install

    gem install departr

Then, run the departr-images to fetch backgrounds (you can run this task every day):

    departr-images 500PX_CONSUMER_KEY 500PX_CONSUMER_SECRET 500PX_USERNAME 500PX_PASSWORD

You need to go there to regirster an application http://500px.com/settings/applications.

All you need now it to open your favorite code editor and create a file `config.ru` that looks like https://github.com/florentsolt/departr/blob/master/config.ru.example
Do not forget to create a RPX account on http://www.janrain.com/ and fill the config under the `rpx` section with your account infos.

Then run it :

    thin start
  
Or :

    rackup
