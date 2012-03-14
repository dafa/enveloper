Enveloper::Engine.routes.draw do
  root :to=>"envelope#index"
  match "info.html" => "envelope#info"
end
