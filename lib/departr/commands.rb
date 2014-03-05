module Departr
  module Command
    extend self

    def filename(provider, user)
      File.join(Config.data_path, provider, user, 'commands')
    end

    def get(provider, user)
      JSON.parse(File.read(filename(provider, user))) rescue sort(Config.commands)
    end

    def time(provider, user)
      if File.exists? filename(provider, user)
        File.mtime(filename(provider, user))
      else
        Time.at(0)
      end
    end

    def default
      Config.commands
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
