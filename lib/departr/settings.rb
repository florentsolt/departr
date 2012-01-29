module Departr
  module Settings
    extend self

    KEYS = [
      :google_feeling_lucky, :open_in_new_page, :google_domain
    ]

    def filename(provider, user)
      File.join(Config.data_path, provider, user, 'settings')
    end

    def etag(provider, user)
      Digest::MD5.hexdigest(get(provider, user).to_s)
    end

    def get(provider, user)
      File.read(filename(provider, user)) rescue default
    end

    def save(provider, user, data)
      File.open(filename(provider, user), 'w') do |fd|
        fd.write data
      end
    end

    def default
      hash = {}
      KEYS.each { |key| hash[key] = Config.get(key) }
      hash.to_json
    end

  end
end
