module Departr
  module Command
    extend self

    def filename(provider, user)
      File.join(Config.data_path, provider, user, 'commands')
    end

    def get(provider, user, parse = true)
      if parse
        JSON.parse(File.read(filename(provider, user))) rescue sort(Config.commands)
      else
        File.read(filename(provider, user)) rescue sort(Config.commands).to_json
      end
    end

    def time(provider, user)
      if File.exists? filename(provider, user)
        File.mtime(filename(provider, user))
      else
        nil
      end
    end

    def etag(provider, user)
      begin
        Digest::MD5.hexdigest(time(provider, user).to_s)
      rescue
        '-no-command-file-'
      end
    end

    def default(parse = true)
      parse ? Config.commands : Config.commands.to_json
    end

    def add(provider, user, command)
      save(provider, user, get(provider, user) + [command])
      command
    end

    def save(provider, user, commands)
      File.open(filename(provider, user), 'w') do |fd|
        fd.write sort(commands).to_json
      end
    end

    def revert(provider, user)
      File.unlink(filename(provider, user))
    end

    def sort(commands)
      commands.sort do |a,b|
        a = a['name'].gsub(/\{\w+\}/, '')
        b = b['name'].gsub(/\{\w+\}/, '')
        a <=> b
      end
    end
  end
end