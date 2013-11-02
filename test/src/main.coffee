require.config
  baseUrl: 'app'

require ['require_config'], ->
  require [
    'spec/components/sticky/main_spec'
  ], ->
    mocha.run()
