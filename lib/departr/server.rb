# encoding: utf-8

module Departr
  class Server < Sinatra::Base

    #-----------------------------------------------------------------------------
    # Constructor
    #-----------------------------------------------------------------------------

    def initialize(*args, &blk)
      super
      Departr::Config.instance_eval(&blk) if block_given?
      @config = Config
      @images = Marshal.load(File.read(File.join(__dir__, '..', 'images.msh')))
    end

    #-----------------------------------------------------------------------------
    # Sinatra settings
    #-----------------------------------------------------------------------------

    set :root, File.join(File.dirname(__FILE__), '..', '..')

    set :sass, {
      :cache_store => Sass::CacheStores::Memory.new,
      :style => Server.production? && :compressed || :expanded
    }

    set :haml, {
      :format => :xhtml,
      :ugly => Server.production?
    }

    set :reload_templates, true if development?

    #-----------------------------------------------------------------------------
    # Helpers
    #-----------------------------------------------------------------------------

    helpers do
      include Rack::Utils
      alias_method :h, :escape_html

      def host
        "http://#{request.host}#{request.port == 80 ? '' : ':' + request.port.to_s}"
      end

      def auth!
        throw(:halt, [401, "Not authorized\n"]) if not auth?
      end

      def auth?
        @provider = request.cookies["provider"]
        @user = request.cookies["user"]
        @session = request.cookies["session"]
        check = Session.valid?(@provider, @user, @session)
        if !check
          puts "Invalid session for #{@provider.inspect}, #{@user.inspect}, #{@session.inspect}"
        end
        check
      end
    end

    #-----------------------------------------------------------------------------
    # Javascripts and stylesheets
    #-----------------------------------------------------------------------------

    get '/javascripts/all.js' do
      content_type :js

      if not defined? @@javascripts
        @@javascripts = ''
        Dir[File.join(settings.root, 'public', 'javascripts', '*.js')].sort.delete_if do |file|
          not File.basename(file).match(/^\d+_/)
        end.each do |file|
          @@javascripts << "\n/* #{File.basename(file)} */\n"
          @@javascripts << File.read(file)
        end
        @@javascripts_checksum = Digest::SHA1.hexdigest(@@javascripts)
        @@javascripts = JSMin.minify(@@javascripts) if Server.production?
      end

      etag "js-#{@@javascripts_checksum}" if Server.production?
      @@javascripts
    end

    get '/stylesheets/all.css' do
      content_type :css
      if Server.production?
        time = File.mtime(File.join(settings.root, 'views', 'style.sass'))
        etag "css-#{time.to_i}"
      end
      sass :style
    end

    #-----------------------------------------------------------------------------
    # Session
    #-----------------------------------------------------------------------------

    post '/signin' do
      if @config.get(:rpx)
        token = params[:token]
        rpx = Rpx::RpxHelper.new(@config.get(:rpx)[:api_key], @config.get(:rpx)[:base_url], @config.get(:rpx)[:realm])
        profile = rpx.auth_info(token, request.url)
        user, session = Session.signin(profile)
        response.set_cookie("session", :value => session, :path => '/', :expires => Time.now + 60*60*24*365)
        response.set_cookie("user", :value => user, :path => '/', :expires => Time.now + 60*60*24*365)
        response.set_cookie("name", :value => profile['preferredUsername'], :path => '/', :expires => Time.now + 60*60*24*365)
        response.set_cookie("provider", :value => profile['providerName'].downcase, :path => '/', :expires => Time.now + 60*60*24*365)
      end
      redirect '/'
    end

    get '/profile' do
      auth!
      Session.profile(@provider, @user, false).to_json
    end

    #-----------------------------------------------------------------------------
    # Settings
    #-----------------------------------------------------------------------------

    get '/settings' do
      auth!
      haml :settings, :layout => false
    end

    post '/settings' do
      auth!
      Settings.save(@provider, @user, JSON.parse(request.body.read))
      status 200
    end

    #-----------------------------------------------------------------------------
    # Commands
    #-----------------------------------------------------------------------------

    get '/command/revert' do
      auth!
      @commands = Command.revert(@provider, @user)
      redirect '/'
    end

    post '/command/save' do
      auth!
      @commands = Command.save(@provider, @user, JSON.parse(request.body.read))
      status 200
    end

    post '/command/add' do
      auth!
      @commands = Command.add(@provider, @user, JSON.parse(request.body.read))
      status 200
    end

    get '/command/all' do
      auth!
      content_type :json
      etag "command-" + Command.etag(@provider, @user) if Server.production?
      Command.get(@provider, @user).to_json
    end

    #-----------------------------------------------------------------------------
    # Index
    #-----------------------------------------------------------------------------

    get '/help' do
      haml :help
    end

    get '/' do
      @background = @images.sample
      if auth?
        @commands = Command.get(@provider, @user)
        @settings = Settings.get(@provider, @user)
      else
        response.delete_cookie("user")
        response.delete_cookie("session")
        @commands = Command.default
        @settings = Settings.default
      end
      haml :index
    end
  end
end
