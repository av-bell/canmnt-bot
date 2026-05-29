import * as Mastodon from 'tsl-mastodon-api';
const mastodon = new Mastodon.API({access_token: 'PRZhmwmS5fpkXo442UE8SGHv8TL7XOiqjhpOh49heb0', api_url: 'https://mastodon.social/api/v1/'}); // access the Mastodon API using the access token.

/*
	getPostText():

	This function performs a Mastodon API GET request to get the n most recent tweets created by Walt Ruff. Using this, the function formats these strings down into the desired plaintext of a Bluesky post, stripping out all of the unnecessary HTML tag notation and handling formatting such that the text is compatible with Bluesky.

	args: None

	returns: A string representing the desired text of the Bluesky posts we want to create. Text for different posts are delimited by \/ characters. 
*/
export default async function getPostText() 
{
	const limitVal = 10; // The number of posts to get from Mastodon.
	var pReg = new RegExp("</p><p>", "g"); // A regex to deal with <p></p>. This should create a new section in the text, which we do via 2 line breaks.
	var brReg = new RegExp("<br>", "g"); // A regex to deal with <br>. This should go to the next line, which we do via a line break. 
	var quoteReg = new RegExp(`\\\\"`, "g"); // A regex to deal with \". This should be replaced with a " value with no \.
	var andReg = new RegExp("&amp;", "g"); // A regex to deal with &amp;. This should be replaced with &.
	var logoReg = new RegExp("&nbsp;", "g"); // A regex to deal with &nbsp;. Should be deleted.
	var twitterReg = new RegExp("@twitter.com", "g"); // A regex to deal with @twitter.com. Should be deleted.
	var sportsBotsReg = new RegExp("@sportsbots.xyz", "g");
	var waltRuffReg = new RegExp("@CANMNT_Official@sportsbots.xyz", "g"); // A regex to deal with Walt Ruff's @. Should be replaced with the bot's @.
	var sportsBotsReg = new RegExp("@sportsbots.xyz", "g");
	var tagReg = new RegExp("<(:?[^>]+)>", "g"); // A general regex for HTML. Used to get the plaintext value of the mastodon post without tag notation.
	var invalidLinkReg = new RegExp("\\S*(\\.com|\\.ca|\\.org|\\.net)\\S*(…|\\.\\.\\.)", "g");

	var awaitTweet = await mastodon.getStatuses("113873729175749717", {'limit':limitVal}); //Use the Mastodon API to get a specified number of recent posts from the Mastodon API.
	var string = JSON.stringify(awaitTweet); // Convert the post into a JSON string.
	var objJSON = JSON.parse(string)["json"]; // Convert the JSON string back to a JSON object. Kinda silly, but it doesn't work otherwise. 
	var stringArr = []; // Initialize an empty array that we will store the regexed plaintexts in.
	var urlArr = [];
	var altTextArr = [];
	var cardArr = [];
	for (let i = 0; i < limitVal; i++) // Iterate over all the posts we collected using the Mastodon API. 
	{
		var postUrlArr = [];
		var postAltTextArr = [];
		for (let j = 0; j < 4; j++)
		{	
			if (objJSON[i]["media_attachments"][j] != undefined)
			{
				if (objJSON[i]["media_attachments"][j]["type"] == "image" || objJSON[i]["media_attachments"][j]["type"] == "gifv" || objJSON[i]["media_attachments"][j]["type"] == "video")
				{
					postUrlArr.push(objJSON[i]["media_attachments"][j]["url"]);
				}
				else
				{
					postUrlArr.push("None");
				}

				if (objJSON[i]["media_attachments"][j]["type"] == "video" || objJSON[i]["media_attachments"][j]["type"] == "gifv")
				{
					postAltTextArr.push(`${objJSON[i]["media_attachments"][j]["meta"]["original"]["width"]}@#*${objJSON[i]["media_attachments"][j]["meta"]["original"]["height"]}@#*${objJSON[i]["media_attachments"][j]["meta"]["original"]["duration"]}@#*${objJSON[i]["media_attachments"][j]["preview_url"]}`);
				}
				else if (objJSON[i]["media_attachments"][j]["description"] == null)
				{
					postAltTextArr.push("None");
				}
				else
				{
					postAltTextArr.push(objJSON[i]["media_attachments"][j]["description"]);
				}
			}
			else
			{
				postUrlArr.push("None");
				postAltTextArr.push("None");
			}
		}
		var postUrl = postUrlArr.join("!^&");
		var postAltText = postAltTextArr.join("!^&");
		urlArr.push(postUrl);
		altTextArr.push(postAltText);
		var contentJSON = objJSON[i]["content"]; // Filter through all the values of the JSON object, to get just the content of post i. 
		var contentString = JSON.stringify(contentJSON); // Convert the content of the post into a JSON string.
		contentString = contentString.slice(1,-1); // Remove the quotation marks.
		contentString = contentString.replace(twitterReg, "").replace(waltRuffReg, "notwaltruff.bsky.social").replace(sportsBotsReg, "").replace(logoReg, "").replace(quoteReg, `"`).replace(andReg, "&").replace(pReg, "\n\n").replace(brReg, "\n").replace(tagReg, ""); //Use the ", &, <p>, and <br> regexes to apply appropriate formatting. Then use the general regex to remove the HTML formatting from the mastodon post. 

		if (contentString.includes("Only on X") || contentString.includes("Real Talk, No Ball") || contentString.includes("salt of the earth") || contentString.includes("poors") || contentString.includes("@RicFlairNatrBoy") || contentString.includes("better than you") || contentString.includes("MJF") || contentString.includes("@tompestock") || contentString.includes("@DraftKings"))
		{
			contentString = "";
		}
		
		if (contentString.includes("@CharlotteFC") 
        	|| contentString.includes("@TSN_Sports")
        	|| contentString.includes("@RDSca ")
			|| contentString.includes("@onesoccer")
        	|| contentString.includes("@tsn_official")
			|| contentString.includes("@KMillz_00") 
        	|| contentString.includes("@VillarrealCF")
        	|| contentString.includes("@Oluwaseyi_9")
        	|| contentString.includes("@SamAdekugbe")
        	|| contentString.includes("@RichieLaryea_")
			|| contentString.includes("@samuelpiette")
			|| contentString.includes("@jessemarsch")
		  	|| contentString.includes("@AlphonsoDavies")
        	|| contentString.includes("@GrgoireSwiders1")
        	|| contentString.includes("@liammillar11")
			|| contentString.includes("@JaydenNelson__")
        	|| contentString.includes("@ttbair")
        	|| contentString.includes("@danjebbison")
			|| contentString.includes("@OsoJ92")
        	|| contentString.includes("@jnrhoilett")
        	|| contentString.includes("@VillarrealCF")
        	|| contentString.includes("@LaLigaEN")
        	|| contentString.includes("@BassongZ")
        	|| contentString.includes("@Ligue1")
        	|| contentString.includes("@Raptors")  
			|| contentString.includes("Happy Birthday!")
        	|| contentString.includes("@GatoradeCanada")  
        	|| contentString.includes("@GE_Appliances") 

		
		   )
		{
			contentString = contentString.replace("@CharlotteFC","Charlotte FC");
			contentString = contentString.replace("@TSN_Sports","TSN");
			contentString = contentString.replace("@RDSca","RDS");
			contentString = contentString.replace("@onesoccer","OneSoccer");
			contentString = contentString.replace("@tsn_official","TSN");
			contentString = contentString.replace("@KMillz_00","Kamal Miller");
			contentString = contentString.replace("@Oluwaseyi_9","Tani Oluwaseyi");
			contentString = contentString.replace("@SamAdekugbe","Sam Adekugbe");
			contentString = contentString.replace("@RichieLaryea_","Richmond Laryea");
			contentString = contentString.replace("@samuelpiette","Samuel Piette");
			contentString = contentString.replace("@AlphonsoDavies","Alphonso Davies");
			contentString = contentString.replace("@jessemarsch","Jesse Marsch");
			contentString = contentString.replace("@GrgoireSwiders1","Grégoire Swiderski");
			contentString = contentString.replace("@liammillar11","Liam Millar");
			contentString = contentString.replace("@Adam_Priest_","Adam Priest")
			contentString = contentString.replace("@JaydenNelson__","Jayden Nelson");
			contentString = contentString.replace("@ttbair","Theo Bair");
			contentString = contentString.replace("@danjebbison","Daniel Jebbison");
			contentString = contentString.replace("OsoJ92","Jonathan Osorio");
			contentString = contentString.replace("@jnrhoilett","Junior Hoilett");
			contentString = contentString.replace("@VillarrealCF","Villarreal CF");
			contentString = contentString.replace("@LaLigaEN","La Liga");
			contentString = contentString.replace("@BassongZ","Zorhan Bassong");
			contentString = contentString.replace("@Ligue1","Ligue 1");
			contentString = contentString.replace("@Raptors","Toronto Raptors");
			contentString = contentString.replace(", présenté par @GE_Appliances","");
			contentString = contentString.replace(", presented by @GE_Appliances","");
			contentString = contentString.replace(", présentée par @GatoradeCanada","");
			contentString = contentString.replace(", fuelled by @GatoradeCanada","");
			
			
		}
		
		if (objJSON[i]["card"] != null)
		{
			contentString = contentString.replace(invalidLinkReg, objJSON[i]["card"]["url"]);
			var postCardArr = [];
			postCardArr.push(objJSON[i]["card"]["url"]);
			postCardArr.push(objJSON[i]["card"]["title"]);
			postCardArr.push(objJSON[i]["card"]["description"]);
			postCardArr.push(objJSON[i]["card"]["image"]);
			var postCard = postCardArr.join("!^&");
			cardArr.push(postCard);
		}
		else
		{
			cardArr.push("None");
		}
		stringArr.push(contentString); // Add the regexed content to the array of plaintexts.
	}
	//urlArr[27] = "None!^&None!^&None!^&None";
	//altTextArr[27] = "None!^&None!^&None!^&None";

	var urls = urlArr.join("@#%");
	var strings = stringArr.join("@#%"); // Turn the string array into a single string by joining them with a \/ delimiter. This will be undone when used by bot functions. 
	var alts = altTextArr.join("@#%"); 
	var cards = cardArr.join("@#%");
	var urlsStringsAltsCardsArr = [urls, strings, alts, cards];
	var urlsStringsAltsCards = urlsStringsAltsCardsArr.join("~~~");
	return urlsStringsAltsCards; // Return this singular concatenated string. 
}
