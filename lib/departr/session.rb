module Departr
  module Session
    extend self

    def filename(provider, user, session_or_profile)
      if session_or_profile == :profile
        file = File.join(Config.data_path, provider, user, 'profile')
      else
        file = File.join(Config.data_path, provider, user, 'session', session_or_profile)
      end
      FileUtils.mkdir_p File.dirname(file) if not File.directory? File.dirname(file)
      file
    end

    def valid?(provider, user, session)
      begin
        File.exists? filename(provider, user, session)
      rescue
        false
      end
    end

    def signin(profile)
      user = Digest::SHA1.hexdigest(profile['identifier'])
      provider = profile['providerName'].downcase
      File.open(filename(provider, user, :profile), 'w') do |fd|
        fd.write profile.to_json
      end
      session = Digest::SHA1.hexdigest("#{profile['identifier']}#{Time.now}#{rand}")
      File.open(filename(provider, user, session), 'w') do |fd|
        fd.write Time.now.to_s
      end
      [user, session]
    end

    def profile(provider, user, parse = true)
      profile = File.read(filename(provider, user, :profile))
      parse ? JSON.parse(profile) : profile
    end
  end
end
