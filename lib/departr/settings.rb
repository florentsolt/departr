module Departr
  module Settings
    extend self

    KEYS = [
      :default_search, :open_in_new_page
    ]

    def filename(provider, user)
      File.join(Config.data_path, provider, user, 'settings')
    end

    def time(provider, user)
      if File.exists? filename(provider, user)
        File.mtime(filename(provider, user))
      else
        Time.at(0)
      end
    end

    def get(provider, user)
      default.merge(JSON.parse(File.read(filename(provider, user)))) rescue default
    end

    def save(provider, user, data)
      File.open(filename(provider, user), 'w') do |fd|
        fd.write data.to_json
      end
    end

    def default
      hash = {}
      # Do not keep symbol because it's save in JSON
      KEYS.each { |key| hash[key.to_s] = Config.get(key) }
      hash
    end

  end
end
