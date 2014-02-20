module Departr
  module Config
    extend self
    
    @data = {
      :data_path => "/tmp",

      # Default settings

      :open_in_new_page => false,
      :default_search => "http://www.google.com/search?ie=UTF-8&oe=UTF-8&q=",

      # Default commands

      :commands => [
        {'name' => "google search for {words}", 'url' => "http://www.google.com/search?rls=en&q={words}&ie=UTF-8&oe=UTF-8"},
        {'name' => "google search for {words} in {lang}", 'url' => "http://www.google.com/search?rls={lang}&q={words}&ie=UTF-8&oe=UTF-8"},
        {'name' => "wikipedia search for {words}", 'url' => "http://en.wikipedia.org/wiki/{words}"},
        {'name' => "twitter search for {words}", 'url' => "https://twitter.com/search?q={words}&src=typd"},
        {'name' => "youtube search for {words}", 'url' => "http://www.youtube.com/results?search_query={words}"},
        {'name' => "dailymotion search for {words}", 'url' => "http://www.dailymotion.com/relevance/search/{words}"},
        {'name' => "facebook search for {words}", 'url' => "http://www.facebook.com/search/?q={words}"},
        {'name' => "news search for {words}", 'url' => "http://news.google.com/news/search?q={words}"},
        {'name' => "images search for {words}", 'url' => "http://images.google.com/images?q={words}"},
        {'name' => "maps to {where}", 'url' => "http://maps.google.com?q={where}"},
        {'name' => "translate {words} in french", 'url' => "http://www.google.com/translate_t?langpair=en|fr&q={words}"},
        {'name' => "translate {words} in english", 'url' => "http://www.google.com/translate_t?langpair=fr|en&q={words}"},
        {'name' => "php search for {word}", 'url' => "http://www.php.net/{word}"},
        {'name' => "delicious search for {tag}", 'url' => "http://delicious.com/tag/{tag}"},
        {'name' => "flickr search for {tag}", 'url' => "http://www.flickr.com/photos/tags/{tag}"},
        {'name' => "lifehacker search for {words}", 'url' => "http://lifehacker.com/search/{words}/"},
        {'name' => "techcrunch search for {words}", 'url' => "http://search.techcrunch.com/query.php?s={words}"},
        {'name' => "down for everyone or just me {domain}", 'url' => "http://downforeveryoneorjustme.com/{domain}"},
        {'name' => "netvibes", 'url' => "http://www.netvibes.com/"},
        {'name' => "flickr", 'url' => "http://www.flickr.com/"},
        {'name' => "facebook", 'url' => "http://www.facebook.com"},
        {'name' => "twitter", 'url' => "http://www.twitter.com"},
        {'name' => "gist", 'url' => "https://gist.github.com"}
      ]
    }

    def set(key, val = nil, &blk)
      if val.is_a? Hash and @data.key? key
        @data[key].update val
      else
        @data[key] = block_given? ? blk : val
      end
    end

    def get(key)
      @data[key]
    end

    def method_missing(name, *args, &blk)
      @data[name]
    end
  end
end

