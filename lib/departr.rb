if defined? Encoding
  Encoding.default_external = Encoding::UTF_8
  Encoding.default_internal = Encoding::UTF_8
end

$: << File.dirname(__FILE__) unless $:.include? File.dirname(__FILE__)
require "digest/sha1"
require "json"
require "tzinfo"
require "haml"
require "sass"
require "fileutils"
require "net/http"
require "sinatra"

# TODO: use gems
require "rpx"
require "jsmin"

require "departr/server"
require "departr/config"
require "departr/settings"
require "departr/session"
require "departr/commands"
