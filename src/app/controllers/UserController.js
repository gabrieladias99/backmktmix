import request from 'request';

class UsarController {
  async findUser(req, res) {
    const {user} = req.params;

    request(`https://graph.facebook.com/v8.0/17841401730342945?fields=business_discovery.username(${user})%7Busername%2Cfollowers_count%2Cmedia_count%2Cprofile_picture_url%7D&access_token=${process.env.FACEBOOK_TOKEN}`,
    function(error, response, body){
     console.log('error:', error);
     console.log('statusCode:', response && response.statusCode)
     let posts = JSON.parse(body);
      return res.status(200).json(posts);
    })
  }s
}

export default new UsarController();

 