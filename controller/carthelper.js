const userplan_tbs = require('../model/userplan_tbs');


module.exports = {
    cartview: (req, res) => {
        userplan_tbs.findOne({login_id:req.params.id},(err,data)=>{
          console.log(data);
        })
    }
        
}