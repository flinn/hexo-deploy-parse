# Parse.com deployer plugin for [Hexo](http://hexo.io/)

**WARNING**: This plugin is only half-baked and setup for my personal use. If there is interest from others, I'm happy to complete things for others to make use of.

With this plugin you can deploy your Hexo site be hosted on Parse.com, execute smoketests on your pages/blogposts, increment the values of "settings" objects stored on Parse, and easily extend your build/deployment/rollback process.

## Usage

### Install

```
npm install hexo-deployer-parse --save
```

### Enable

Add `hexo-deployer-parse` to `plugins` in `_config.yml`.

``` yaml
plugins:
- hexo-deployer-parse
```

### Disable

Remove `hexo-deployer-parse` from `plugins` in `_config.yml`.

``` yaml
plugins:
- hexo-deployer-parse
```

### Update

Execute the following command.

```
npm update
```

### Uninstall

Execute the following npm command. (Don't forget to disable the plugin by removing it from your `_config.yml` file's plugin list in addition to uninstalling the npm package, otherwise Hexo will yell at you...)

```
npm uninstall hexo-deployer-parse
```


## Configuration

This explains how to configure your deployment options.

### Quickstart

To get your started quickly, a **simple** build configuration in your "_config.yml" file might look something like this...

```
deploy:
  type: parse
  included_folders: ['assets/img:public/img']
  deployment_timeout: 60
  load_in_browser: true  
```

This configuration would ensure that:
- The `assets/img` folder will be copied over to `public/img` before your deployment to Parse.com begins.
- The deployment will throw an error and exit if it does not **complete** in less than 60 seconds. This timeout should include time for generating a build, deploying that build to parse, running all URL tests, and the entire deployment process.
- After deployment completes your site will be loaded in a new window by your default web browser because `load_in_browser` is set to `true`.

### Parse Settings

If you'd like to have the deployer increment settings values locally and on Parse.com as part of your deployment process, the plugin will need access to your Parse.com App's `Application ID` and `JavaScript Key`. 

Add these keys to your `_config.yml` file in the deploy settings under the "parse" property as `app_id` and `js_key` respectively.

```
deploy:
  type: parse
  included_folders: ['assets/img:public/img', 'src/cloud_code:cloud']
  load_in_browser: true
  deployment_timeout: 60
  parse: 
    app_id: <Your Parse.com App's ID>
    js_key: <Your Parse.com App's JavaScript Key>    
    object: appSettings
    settings_file: config/settings.json
  url_tests:
    urls: ['/home', '/about', '/contact']
    check_posts: true
    rollback_cmd: hexo rollback  
```

As you can see above, there are also a couple other options included in the parse settings within the "_config.yml" file like `object` and `settings_file`.

**object**: This is the name of the Parse.com "Object" in which you want your app's deployment settings object stored. This allows your server side code to be aware of the last time it was successfully deployed to and allows you to track the version of your site based on how many times you have deployed it.

**settings_file**: This is the relative path to the local file where deployment settings will be updated/stored. (**NOTE**: This file will need to be created initially by you! Sorry, I'm lazy.)

You should create a file at this path that looks like this to start...

```
{
  "name": "",
  "version": 0,
  "last_deployed": ""
}  
```

These values will be updated for you automatically upon each deployment.

### URL Tests

If you'd like for the deployer to check the status of your pages after deployment, include these options in your `_config.yml` file...

```
deploy
  type: parse
  deployment_timeout: 70
  url_tests:
    urls: ['blog/', 'about/', 'projects/', 'contact/',]
    check_posts: true
    rollback_cmd: hexo rollback
```

These options tell the deployer which (relative) URLs to check after your deployment has completed to ensure that your pages still work. This just pings each and ensures that an HTTP status code of 200 is returned. 

If you have set `check_posts` to `true`, the deployer will also trigger a custom hexo "generator" that creates a file called `list.json` in the `public/deployer/posts/` folder of your project that will contain a list of all your posts including their `title` and `permalink` attributes. It will test all of your post's URLs to ensure that they have an HTTP status code of 200 as well.

If you've set a `rollback_cmd`, this command will be run in the event that any of your URL tests fail. I suggest creating a custom script that will roll your site back to the previous (and hopefully working) version.

### Included Folders

This is where you specify the folders that you'd like to have included in your deployment to Parse. The syntax for including folders is to add the source and destination paths, seperated by a colon (:), to an array like this: `['<path_to_source_folder>:<path_to_destination_folder>', etc, etc...]`

### Browser Load

This can be `true`, `false`, or a URL like `http://your-app-name.parseapp.com`. This tells the deployer to open your browser and navigate to either your hexo configuration's root URL or to the URL that you specify once deployment is complete. Set this value to `false` if you'd prefer that it didn't open your browser for you.

### Deployment Timeout

This is the amount of time, in seconds, that the deployer will wait for the deployment to Parse.com to be completed before it assumes that the deployment has failed and exits.


[Hexo]: http://hexo.io