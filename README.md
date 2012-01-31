# Departr

Departr is a smart and fast startpage to help you reach other web sites.

# How to install

    gem install departr

All you need now it to open your favorite code editor and create a file `config.ru` that looks like https://github.com/florentsolt/departr/blob/master/config.ru.example
Do not forget to create a RPX account on http://www.janrain.com/ and fill the config under the `rpx` section with your account infos.

Then run it :
    thin start
  
Or :
    rackup