# -*- encoding: utf-8 -*-

Gem::Specification.new do |s|
  s.name        = "departr"
  s.version     = 0.5.1
  s.date        = '2014-02-20'
  s.platform    = Gem::Platform::RUBY
  s.author      = "Florent Solt"
  s.email       = "florent@solt.biz"
  s.homepage    = "https://github.com/florentsolt/departr"
  s.summary     = "Departr is a smart and fast startpage to help you reach other web sites."

  s.files         = `git ls-files`.split("\n")
  s.test_files    = `git ls-files -- {test,spec,features}/*`.split("\n")
  s.executables   = `git ls-files -- bin/*`.split("\n").map{ |f| File.basename(f) }
  s.require_paths = ["lib"]

  s.add_runtime_dependency("haml",              ["~> 4.0"])
  s.add_runtime_dependency("sass",              ["~> 3.2"])
  s.add_runtime_dependency("sinatra",           ["~> 1.4"])
  s.add_runtime_dependency("oauth",             ["~> 0.4"])
end
