$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "enveloper/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "enveloper"
  s.version     = Enveloper::VERSION
  s.authors     = ["Dafa"]
  s.email       = ["dafanya@gmail.com"]
  s.homepage    = "https://github.com/dafa/enveloper"
  s.summary     = "Enveloper allows you to see how your site looks at small window sizes without resizing the browser window"
  s.description = "TODO: Description of Enveloper."

  s.files = Dir["{app,config,db,lib}/**/*"] + ["MIT-LICENSE", "Rakefile", "README.rdoc"]
  s.test_files = Dir["test/**/*"]

  s.add_dependency "rails", "~> 3.2.2.rc1"
  s.add_dependency "jquery-rails"

  s.add_development_dependency "sqlite3"
end
