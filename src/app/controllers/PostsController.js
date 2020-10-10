import request from 'request';

class PostsController {
  async allPosts(req, res) {
    const {user} = req.params;
    request(`https://graph.facebook.com/v8.0/17841401730342945?fields=business_discovery.username(${user})%7Bfollowers_count%2Cmedia_count%2Cmedia.limit(300)%7Bcomments_count%2Clike_count%2Ccaption%7D%7D&access_token=${process.env.FACEBOOK_TOKEN}`,
    function(error, response, body){
     console.log('error:', error);
     console.log('statusCode:', response && response.statusCode)
     let posts = JSON.parse(body);
      return res.status(200).json(posts);
    })
  }

  async bestPosts(req,res){
    const {user} = req.params;
    
    request(`https://graph.facebook.com/v8.0/17841401730342945?fields=business_discovery.username(${user})%7Bfollowers_count%2Cmedia_count%2Cmedia.limit(300)%7Bcomments_count%2Cmedia_type%2Cmedia_url%2Clike_count%2Ccaption%7D%7D&access_token=${process.env.FACEBOOK_TOKEN}`,
    function(error, response, body){
     console.log('error:', error);
     console.log('statusCode:', response && response.statusCode)
     const requisition = JSON.parse(body);

     const posts = requisition.business_discovery.media.data;
     const bestPosts = getBestPosts(posts);
     return res.status(200).json(bestPosts);
    })

    function compare( a, b ) {
      if ( a.like_count + a.comments_count < b.like_count + b.comments_count ){
        return 1;
      }
      if ( a.like_count + a.comments_count > b.like_count + b.comments_count ){
        return -1;
      }
      return 0;
    }

    const getBestPosts = (posts)=>{
      const orderedPosts = posts.sort(compare);
      const threeBestPosts = orderedPosts.slice(0,3);

      let totalVideos =0;
      let totalImages = 0;
      let totalCommentsVideo = 0;
      let totalCommentsImage = 0;
      let totalLikesVideo = 0;
      let totalLikesImage = 0;
      let hashtags = [];

      const regex = new RegExp('\\#[^\\s?!.*\\n]+', 'g');
      orderedPosts.map(function(post){
        if(post.media_type == "VIDEO"){
          totalVideos +=1
          totalCommentsVideo += post.comments_count;
          totalLikesVideo += post.like_count;
          hashtags.push(post.caption.match(regex))
        }
        else{
          totalImages +=1
          totalCommentsImage += post.comments_count;
          totalLikesImage += post.like_count
        }
      })
       
      const hashtagsArray = [].concat.apply([], hashtags).filter((el)=>el != null);
      const uniq = [...new Set(hashtagsArray)];
      console.log(uniq)


      const mediaCommentsVideo = Math.floor(totalCommentsVideo/totalVideos);
      const mediaCommentsImage = Math.floor(totalCommentsImage/totalImages);
      const mediaLikesVideo = Math.floor(totalLikesVideo/totalVideos);
      const mediaLikesImage = Math.floor(totalLikesImage/totalImages);

      const data = {
        mediaCommentsImage : mediaCommentsImage,
        mediaCommentsVideo : mediaCommentsVideo,
        mediaLikesVideo : mediaLikesVideo,
        mediaLikesImage : mediaLikesImage,
        threeBestPosts : threeBestPosts
      }

      return data;
    }
  }
}

export default new PostsController();

 