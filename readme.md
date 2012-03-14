# Enveloper

A small script &amp; rails 3.2 engine that allows you to see how your site looks at small window sizes without resizing the browser window.

## Usage

Rails 3.2 engine could be used with your rails application by mounting it in routes.rb of your progect. Like
    mount Enveloper::Engine => "/enveloper"

Also enveloper could be used as a set of static files. You can take them from gh-pages branch of this project.
You can test the script at http://dafa.github.com/enveloper/. Type the url you'd like to see in the address bar as a hash. As a fallback "open in new window" button rises new window of selected size.