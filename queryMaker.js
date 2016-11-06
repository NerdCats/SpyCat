module.exports = {
	reportQuery : function (params) {

		if (params.query.usertype === "BIKE_MESSENGER" && params.query.userid && params.query.userid.length === 24) {
			var userid = "Assets." + params.query.userid;
			var dynObj = {};
			dynObj[userid] = { $exists : true};
			dynObj["CreateTime"] = {
		        $gte: new Date(params.query.startdate),
		        $lt: new Date(params.query.enddate),
		    };
			return dynObj;
		} else if (params.query.username) {
			return {
				"User.UserName" : params.query.username,
				"CreateTime" : {
			        $gte: new Date(params.query.startdate),
			        $lt: new Date(params.query.enddate),
			    }
			}
		}

		else if (params.query.usertype === "BIKE_MESSENGER") {
			return {
					"CreateTime" : {
					        $gte: new Date(params.query.startdate),
					        $lt: new Date(params.query.enddate),
				    }				 
				}
		}
		else 
			return {
					"CreateTime" : {
					        $gte: new Date(params.query.startdate),
					        $lt: new Date(params.query.enddate),
				    },
				    "User.Type" : params.query.usertype || "ENTERPRISE"
				}
	},

	productSearchQuery : function (area, keyword) {
		console.log(area + " " + keyword)
	    return {
	    	
		    $and: [
		        {
		            "SupportedAreas": {
		                $in: [ new RegExp(area, 'i')]
		            }
		        },
		        {
		            $or: [
		                    {
		                        "ProductCategories": {
		                            $in: [new RegExp(keyword,'i')]
		                        }
		                    },
		                    {
		                        "StoreName" : new RegExp(keyword,'i')
		                    },
		                    {
		                        "Products": {
		                            $elemMatch : {
		                                "Name": new RegExp(keyword,'i')
		                            }
		                        }
		                    }
		                 ]
		        }
		    ]
		}
	}
}