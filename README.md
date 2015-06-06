esformatter-plugins
> Simple client-side app to browse and search esformatter plugins

This app is a simple client-side app that allows one to browse and search esformatter plugins.
It fetches data from [npmsearch](http://npmsearch.com/) with the keyword *esformatter-plugin*.
npmsearch also provides rankings for plugins.

Built with [AngularJS](http://angularjs.org) and [gulp](http://gulpjs.com/)

## Install

```sh
$ git clone git@github.com:pgilad/esformatter-plugins.git
```

## Development and deployment

Several tasks are available from gulp for development and deployment:

- `gulp`: Builds the project on the master branch
- `gulp deploy`: Builds the project for production and deploys by pushing to the `gh-pages` branch.
- `gulp serve`: Start a web server serving by default at `localhost:5000`

## Contributing

Welcomed!!

## Credits

Most of this project is shamelessly copied from [gulp-plugins](https://github.com/gulpjs/plugins)

## License

MIT
