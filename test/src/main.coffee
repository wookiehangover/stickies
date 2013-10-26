require.config
  baseUrl: 'app'

require ['require-config'], ->
  require [
    'spec/components/sticky/main-spec'
  ], ->
    mocha.run()
