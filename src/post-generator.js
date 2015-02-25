var path = require('path');
var _ = require('underscore');
var baseUrl = '/deployer';

function postsPath() {
  return path.resolve(baseUrl, 'posts/list.json');
}

function makePost(post) {
  return _.pick(post, 'title', 'permalink');
}

function generatePosts(locals, callback) {
  var result = {};

  result.posts = _.map(locals.posts.toArray(), function(post) {   
    return makePost(post);    
  });

  hexo.route.set(postsPath(), JSON.stringify(result));

  callback();
}

module.exports = {

  generatePosts: generatePosts
  
};



  