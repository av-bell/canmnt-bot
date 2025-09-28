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
	const limitVal = 17; // The number of posts to get from Mastodon.
	var pReg = new RegExp("</p><p>", "g"); // A regex to deal with <p></p>. This should create a new section in the text, which we do via 2 line breaks.
	var brReg = new RegExp("<br>", "g"); // A regex to deal with <br>. This should go to the next line, which we do via a line break. 
	var quoteReg = new RegExp(`\\\\"`, "g"); // A regex to deal with \". This should be replaced with a " value with no \.
	var andReg = new RegExp("&amp;", "g"); // A regex to deal with &amp;. This should be replaced with &.
	var logoReg = new RegExp("&nbsp;", "g"); // A regex to deal with &nbsp;. Should be deleted.
	var twitterReg = new RegExp("@twitter.com", "g"); // A regex to deal with @twitter.com. Should be deleted.
	var sportsBotsReg = new RegExp("@sportsbots.xyz", "g");
	var waltRuffReg = new RegExp("@AEW@sportsbots.xyz", "g"); // A regex to deal with Walt Ruff's @. Should be replaced with the bot's @.
	var sportsBotsReg = new RegExp("@sportsbots.xyz", "g");
	var tagReg = new RegExp("<(:?[^>]+)>", "g"); // A general regex for HTML. Used to get the plaintext value of the mastodon post without tag notation.
	var invalidLinkReg = new RegExp("\\S*(\\.com|\\.ca|\\.org|\\.net)\\S*(…|\\.\\.\\.)", "g");

	var awaitTweet = await mastodon.getStatuses("111840105523898246", {'limit':limitVal}); //Use the Mastodon API to get a specified number of recent posts from the Mastodon API.
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

		if (contentString.includes("@aaron_solo_") // Aaron Solo
			|| contentString.includes("@ActionAndretti")
			|| contentString.includes("@actionandretti")
			|| contentString.includes("@AdamColePro")
			|| contentString.includes("@adamcolepro")
			|| contentString.includes("@Angelico_AEW")
			|| contentString.includes("@annajay___")
			|| contentString.includes("@AnthonyOgogo")
			|| contentString.includes("@AntnyHenry")  
			|| contentString.includes("@Antnyhenry")  
			|| contentString.includes("@ajbefumo") 
			|| contentString.includes("@Amisylle") 
			|| contentString.includes("@AthenaPalmer_FG")
			|| contentString.includes("@ARealFoxx")
			|| contentString.includes("@refaubrey")
			|| contentString.includes("@RefAubrey")
			|| contentString.includes("@BandidoWrestler") 
			|| contentString.includes("@bandidowrestler") 
			|| contentString.includes(".@BandidoWrestler") 
			|| contentString.includes(".@bandidowrestler") 
			|| contentString.includes("@BeastMortos") 
			|| contentString.includes("@billiestarkz") 
			|| contentString.includes("@Bowens_Official") 
			|| contentString.includes(".@Bowens_Official") 
			|| contentString.includes("@BryanDanielson")  
			|| contentString.includes("@bryandanielson")
			|| contentString.includes(".@bryandanielson")
			|| contentString.includes(".@BryanDanielson") 
			|| contentString.includes("@BrodyXKing")  
			|| contentString.includes("@Brodyxking")  
			|| contentString.includes(".@BrodyXKing")  
			|| contentString.includes(".@Brodyxking")
			|| contentString.includes("@CallMeKrisStat") 
			|| contentString.includes(".@CallMeKrisStat") 
			|| contentString.includes("@callmekrisstat") 
			|| contentString.includes(".@callmekrisstat")
			|| contentString.includes("@CashWheelerFTR")
			|| contentString.includes("@CMLL_OFICIAL")  
 			|| contentString.includes("@Christian4Peeps")  
			|| contentString.includes("@DarbyAllin") 
			|| contentString.includes(".@DarbyAllin") 
			|| contentString.includes("@DARBYALLIN") 
			|| contentString.includes(".@DARBYALLIN") 
			|| contentString.includes("@DaxFTR")  
			|| contentString.includes("@FightBobby")  
			|| contentString.includes("@fightbobby")
			|| contentString.includes("@HailWindsor")
			|| contentString.includes("@hailwindsor")
			|| contentString.includes("@HarleyCameron_")  
			|| contentString.includes("@harleycameron_")  
 			|| contentString.includes("@HBOMax")  
			|| contentString.includes("@IAmJericho")  
			|| contentString.includes("@itsjerrylynn")  
			|| contentString.includes(".@itsjerrylynn")
			|| contentString.includes("@JonMoxley") 
			|| contentString.includes(".@JonMoxley")
			|| contentString.includes("@Jet2Flyy")  
			|| contentString.includes("@jmehytr")  
			|| contentString.includes("@JmeHytr")
			|| contentString.includes(".@jmehytr")  
			|| contentString.includes(".@JmeHytr")
			|| contentString.includes("@KingRicochet")  
			|| contentString.includes("@KyleFletcherPro")  
			|| contentString.includes(".@KyleFletcherPro") 
			|| contentString.includes("@kylefletcherpro")
			|| contentString.includes(".@KyleFletcherPro")
			|| contentString.includes("@K_Shibata2022") 
			|| contentString.includes("@Lucha_Angel1") 
			|| contentString.includes("@luchasaurus") 
			|| contentString.includes(".@luchasaurus") 
			|| contentString.includes("@MercedesVarnado") 
			|| contentString.includes("@MinaShirakawa")  
			|| contentString.includes(".@MinaShirakawa") 
			|| contentString.includes("@MotherAEW")  
			|| contentString.includes("@MeganBayne")  
			|| contentString.includes("@meganbayne")  
			|| contentString.includes("@MascaraDoradMD") 
			|| contentString.includes("@PlatinumMax") 
			|| contentString.includes(".@PlatinumMax") 
			|| contentString.includes("@PrimeVideo")  
			|| contentString.includes("@ppv_com")  
			|| contentString.includes("@RainmakerXOkada")  
			|| contentString.includes("@rainmakerXokada")  
			|| contentString.includes("@RatedRCope") 
			|| contentString.includes("@ReneePaquette")  
			|| contentString.includes("@RealJDDrake")  
			|| contentString.includes("@RoderickStrong")  
			|| contentString.includes("@roderickstrong") 
			|| contentString.includes(".@RoderickStrong")  
			|| contentString.includes(".@roderickstrong")
			|| contentString.includes("@SamoaJoe")  
			|| contentString.includes("@samoajoe")  
			|| contentString.includes("@SportsonMax")
			|| contentString.includes("@SheltyB803")  
			|| contentString.includes("@SpeedballBailey")  
			|| contentString.includes("@SkyeByee")  
			|| contentString.includes("@Skyebyee")  
			|| contentString.includes("@SussexCoChicken") 
			|| contentString.includes("@takesoup")  
			|| contentString.includes("@Takesoup")  
			|| contentString.includes("@TBSNetwork")
			|| contentString.includes("@tntdrama")
			|| contentString.includes("@TNTDrama")
			|| contentString.includes("@TNTdrama")
			|| contentString.includes("@The_Ace_Austin")
			|| contentString.includes("@the_ace_austin")
			|| contentString.includes("@theaustingunn")
			|| contentString.includes("@TheAngeloParker")
			|| contentString.includes("@TheCaZXL")  
			|| contentString.includes(".@TheCaZXL") 
			|| contentString.includes("@TheDonCallis")  
			|| contentString.includes("@The305MVP")  
			|| contentString.includes("@The_MJF") 
			|| contentString.includes(".@The_MJF") 
			|| contentString.includes("@thenickwayne")
			|| contentString.includes("@TheJuliaHart")
			|| contentString.includes(".@TheJuliaHart")
			|| contentString.includes("@thejuliahart")  
			|| contentString.includes("@thekaun")  
			|| contentString.includes("@TheKaun")  
			|| contentString.includes("@ThePenelopeFord")  
			|| contentString.includes("@thePenelopeFord")  
			|| contentString.includes("@TheKipSabian")  
			|| contentString.includes("@ToaLiona") 
			|| contentString.includes(".@ToaLiona")
			|| contentString.includes("@TopFlight612") 
			|| contentString.includes(".@TopFlight612") 
			|| contentString.includes("@Toxic_Thekla")  
			|| contentString.includes(".@Toxic_Thekla")  
			|| contentString.includes("@toxic_thekla")  
			|| contentString.includes(".@toxic_thekla") 
			|| contentString.includes("@TOXIC_THEKLA")
			|| contentString.includes("@TonyKhan")  
			|| contentString.includes("@TrueWillieHobbs")  
			|| contentString.includes("@Triller_TV")  
			|| contentString.includes("@Walking_Weapon")  
			|| contentString.includes("@WillowWrestles")  
			|| contentString.includes(".@WillowWrestles") 
			|| contentString.includes("@willowwrestles")  
			|| contentString.includes(".@willowwrestles")  
			|| contentString.includes("@YoungBucks") 
			|| contentString.includes("@youngbucks") 
			|| contentString.includes("@_ReyHechicero")
		    || contentString.includes("@RealBillyGunn")
			|| contentString.includes("@_BlakeChristian")
			|| contentString.includes(".@_BlakeChristian")
			|| contentString.includes("@_blakechristian")
			|| contentString.includes(".@_blakechristian")
			|| contentString.includes("@BigShottyLee")
			|| contentString.includes(".@BigShottyLee")
			|| contentString.includes("@bigshottylee")
			|| contentString.includes(".@bigshottylee")
			|| contentString.includes("@BranCutler")
			|| contentString.includes("@briancagegmsi")
			|| contentString.includes("@bountykeith")
			|| contentString.includes(".@bountykeith")
			|| contentString.includes("@dabryceisright")
			|| contentString.includes("@SNM_Buddy")
			|| contentString.includes("@carliebravo")
			|| contentString.includes("@facdaniels")
			|| contentString.includes("@SexyChuckieT")
			|| contentString.includes("@ClaudioCSRO")
			|| contentString.includes(".@ClaudioCSRO")
			|| contentString.includes("@coltengunn")
			|| contentString.includes("@theDALTONcastle")
			|| contentString.includes("@DariusMartin612")
			|| contentString.includes("@DeonnaPurrazzo")
			|| contentString.includes("@DiamanteLAX")
			|| contentString.includes("@realbrittbaker")
			|| contentString.includes("@DRALISTICO_LFI")
			|| contentString.includes("@dustinrhodes")
			|| contentString.includes("@EmiSakura_gtmv")
			|| contentString.includes("@EvilUno")
			|| contentString.includes("@ShutUpExcalibur")
			|| contentString.includes("@shidahikaru")
			|| contentString.includes("@AEWHologram")
			|| contentString.includes("@730hook")
			|| contentString.includes(".@AEWHologram")
			|| contentString.includes(".@730hook")
			|| contentString.includes("@ianriccaboni")
			|| contentString.includes("@boy_myth_legend")
			|| contentString.includes("@boymythlegend")
			|| contentString.includes(".@boy_myth_legend")
			|| contentString.includes(".@boymythlegend")
			|| contentString.includes("@TheLethalJay")
			|| contentString.includes("@jaywhitenz")
			|| contentString.includes("@RealJeffJarrett")
			|| contentString.includes("@JRsBBQ")
			|| contentString.includes("@KennyOmegamanX")
			|| contentString.includes(".@KennyOmegamanX")
			|| contentString.includes("@KomandercrMX")
			|| contentString.includes(".@KomandercrMX")
			|| contentString.includes("@ibushi_kota")
			|| contentString.includes("@KORcombat")
			|| contentString.includes(".@KORcombat")
			|| contentString.includes("@LanceHoyt")
			|| contentString.includes("@RasselinDoc")
			|| contentString.includes("@MarinaShafir")
			|| contentString.includes("@dunkzilladavis")
			|| contentString.includes("@theDaddyMagic")
			|| contentString.includes(".@theDaddyMagic")
			|| contentString.includes("@McGuinnessNigel")
			|| contentString.includes("@orangecassidy")
			|| contentString.includes(".@orangecassidy")
			|| contentString.includes("@bastardpac")
			|| contentString.includes("@PrinceKingNana")
			|| contentString.includes("@RJCity1")
			|| contentString.includes("@realrubysoho")
			|| contentString.includes("@sammyguevara")
			|| contentString.includes("@Shane216Taylor")
			|| contentString.includes("@swerveconfident")
			|| contentString.includes("@ThunderRosa22")
			|| contentString.includes("@tonyschiavone24")
			|| contentString.includes("@Trentylocks")
			|| contentString.includes("@TruthMagnum")
			|| contentString.includes("@turbofloyd_")
			|| contentString.includes("@WheelerYuta")
			|| contentString.includes(".@WheelerYuta")
		    || contentString.includes("@Sting")
		    || contentString.includes("@theleemoriarty")
		    || contentString.includes(".@theleemoriarty")
			|| contentString.includes("@theLeeMoriarty")
		    || contentString.includes(".@theLeeMoriarty")
			|| contentString.includes("@Ortiz_Powerful")
		    || contentString.includes("Happy Birthday! @DariusMartin612")
			|| contentString.includes("Happy Birthday! @SNM_Buddy")
			|| contentString.includes("Happy Birthday! @Ortiz_Powerful")
		   
		   )
		{
			contentString = contentString.replace("@aaron_solo_","Aaron Solo");
			contentString = contentString.replace("@ActionAndretti","Action Andretti");
			contentString = contentString.replace("@actionandretti","Action Andretti");
			contentString = contentString.replace("@AdamColePro","Adam Cole");
			contentString = contentString.replace("@adamcolepro","Adam Cole");
			contentString = contentString.replace("@Amisylle","Queen Aminata");
			contentString = contentString.replace("@amisylle","Queen Aminata");
			contentString = contentString.replace("@Angelico_AEW","Angelico");
			contentString = contentString.replace("@TheAngeloParker","Angelo Parker");
			contentString = contentString.replace("@annajay___","Anna Jay");
			contentString = contentString.replace("@AnthonyOgogo","Anthony Ogogo");
			contentString = contentString.replace("@AntnyHenry","Anthony Henry");
			contentString = contentString.replace("@Antnyhenry","Anthony Henry");
			contentString = contentString.replace("@AthenaPalmer_FG","Athena");
			contentString = contentString.replace("@ARealFoxx","AR Fox");
			contentString = contentString.replace("@refaubrey","Aubrey Edwards");
			contentString = contentString.replace("@RefAubrey","Aubrey Edwards");
			contentString = contentString.replace("@BandidoWrestler","Bandido");
			contentString = contentString.replace("@bandidowrestler","Bandido");
			contentString = contentString.replace("@BandidoWrestler","Bandido");
			contentString = contentString.replace(".@bandidowrestler","Bandido");
			contentString = contentString.replace(".@BeastMortos","Beast Mortos");
			contentString = contentString.replace("@ajbefumo","Big Boom AJ");
			contentString = contentString.replace("@billiestarkz","Billie Starkz");
			contentString = contentString.replace("@Bowens_Official","Anthony Bowens");
			contentString = contentString.replace(".@Bowens_Official","Anthony Bowens");
			contentString = contentString.replace("@BryanDanielson","Bryan Danielson");
			contentString = contentString.replace(".@BryanDanielson","Bryan Danielson");
			contentString = contentString.replace("@bryandanielson","Bryan Danielson");
			contentString = contentString.replace(".@bryandanielson","Bryan Danielson");
			contentString = contentString.replace("@BrodyXKing","Brody King");
			contentString = contentString.replace("@Brodyxking","Brody King");
			contentString = contentString.replace(".@BrodyXKing","Brody King");
			contentString = contentString.replace(".@Brodyxking","Brody King");
			contentString = contentString.replace("@CallMeKrisStat","Kris Statlander");
			contentString = contentString.replace("@callmekrisstat","Kris Statlander");
			contentString = contentString.replace(".@CallMeKrisStat","Kris Statlander");
			contentString = contentString.replace(".@callmekrisstat","Kris Statlander");
			contentString = contentString.replace("@Christian4Peeps","Christian Cage");
			contentString = contentString.replace("@CashWheelerFTR","Cash Wheeler");
			contentString = contentString.replace("@CMLL_OFICIAL","CMLL");
			contentString = contentString.replace("@DarbyAllin","Darby Allin");
			contentString = contentString.replace(".@DarbyAllin","Darby Allin");
			contentString = contentString.replace("@DARBYALLIN","DARBY ALLIN");
			contentString = contentString.replace(".@DARBYALLIN","DARBY ALLIN");
			contentString = contentString.replace("@DaxFTR","Dax Harwood");
			contentString = contentString.replace("@fightbobby","Bobby Lashley");
			contentString = contentString.replace("@FightBobby","Bobby Lashley");
			contentString = contentString.replace("@HailWindsor","Alex Windsor");
			contentString = contentString.replace("@hailwindsor","Alex Windsor");
			contentString = contentString.replace("@HarleyCameron_","Harley Cameron");
			contentString = contentString.replace("@harleycameron_","Harley Cameron");
			contentString = contentString.replace("@HBOMax","HBO Max");
			contentString = contentString.replace("@IAmJericho","Chris Jericho");
			contentString = contentString.replace("@itsjerrylynn","Jerry Lynn");
			contentString = contentString.replace(".@itsjerrylynn","Jerry Lynn");
			contentString = contentString.replace("@JonMoxley","Jon Moxley");
			contentString = contentString.replace(".@JonMoxley","Jon Moxley");
			contentString = contentString.replace("@Jet2Flyy","Kevin Knight");
			contentString = contentString.replace("@jmehytr","Jamie Hayter");
			contentString = contentString.replace("@JmeHytr","Jamie Hayter");
			contentString = contentString.replace(".@jmehytr","Jamie Hayter");
			contentString = contentString.replace(".@JmeHytr","Jamie Hayter");
			contentString = contentString.replace("@KingRicochet","Ricochet");
			contentString = contentString.replace("@KyleFletcherPro","Kyle Fletcher");
			contentString = contentString.replace(".@KyleFletcherPro","Kyle Fletcher");
			contentString = contentString.replace("@kylefletcherpro","Kyle Fletcher");
			contentString = contentString.replace(".@kylefletcherpro","Kyle Fletcher");
			contentString = contentString.replace("@K_Shibata2022","Shibata");
			contentString = contentString.replace("@Lucha_Angel1","Dante Martin");
			contentString = contentString.replace(".@luchasaurus","Luchasaurus");
			contentString = contentString.replace("@luchasaurus","Luchasaurus");
			contentString = contentString.replace("@MercedesVarnado","Mercedes Moné");
			contentString = contentString.replace("@MinaShirakawa","Mina Shirakawa");
			contentString = contentString.replace(".@MinaShirakawa","Mina Shirakawa");
			contentString = contentString.replace("@MotherAEW","Mother Wayne");
			contentString = contentString.replace("@MeganBayne","Megan Bayne");
			contentString = contentString.replace("@meganbayne","Megan Bayne");
			contentString = contentString.replace("@MascaraDoradMD","Máscara Dorada");
			contentString = contentString.replace("@PlatinumMax","Max Caster");
			contentString = contentString.replace(".@PlatinumMax","Max Caster");
			contentString = contentString.replace("@PrimeVideo","Prime Video");
			contentString = contentString.replace("@ppv_com","PPV.com");
			contentString = contentString.replace("@RatedRCope","Adam Copeland");
			contentString = contentString.replace("@ReneePaquette","Renee Paquette");
			contentString = contentString.replace("@RainmakerXOkada","Okada");
			contentString = contentString.replace("@rainmakerXokada","Okada");
			contentString = contentString.replace("@RealJDDrake","JD Drake");
			contentString = contentString.replace("@RoderickStrong","Roderick Strong");
			contentString = contentString.replace("@roderickstrong","Roderick Strong");
			contentString = contentString.replace(".@RoderickStrong","Roderick Strong");
			contentString = contentString.replace(".@roderickstrong","Roderick Strong");
			contentString = contentString.replace("@SamoaJoe","Samoa Joe");
			contentString = contentString.replace("@SpeedballBailey","Speedball Mike Bailey");
			contentString = contentString.replace("@SkyeByee","Skye Blue");
			contentString = contentString.replace("@Skyebyee","Skye Blue");
			contentString = contentString.replace("@SheltyB803","Shelton Benjamin");
			contentString = contentString.replace("@Sheltyb803","Shelton Benjamin");
			contentString = contentString.replace("@SportsonMax","HBO Max");
			contentString = contentString.replace("@SussexCoChicken","Mark Briscoe");
			contentString = contentString.replace("@TBSNetwork","TBS");
			contentString = contentString.replace("@The_Ace_Austin","Ace Austin");
			contentString = contentString.replace("@the_ace_austin","Ace Austin");
			contentString = contentString.replace("@takesoup","Konosuke Takeshita");
			contentString = contentString.replace("@Takesoup","Konosuke Takeshita");
			contentString = contentString.replace("@tntdrama","TNT");
			contentString = contentString.replace("@TNTdrama","TNT");
			contentString = contentString.replace("@TNTDrama","TNT");
			contentString = contentString.replace("@The305MVP","MVP");
			contentString = contentString.replace("@theaustingunn","Austin Gunn");
			contentString = contentString.replace("@The_MJF","MJF");
			contentString = contentString.replace(".@The_MJF","MJF");
			contentString = contentString.replace(".MJF","MJF");
			contentString = contentString.replace("@thenickwayne","Nick Wayne");
			contentString = contentString.replace("@TheDonCallis","Don Callis");
			contentString = contentString.replace("@TheCaZXL","Big Bill");
			contentString = contentString.replace(".@TheCaZXL","Big Bill");
			contentString = contentString.replace("@TheJuliaHart","Julia Hart");
			contentString = contentString.replace("@thejuliahart","Julia Hart");
			contentString = contentString.replace(".@TheJuliaHart","Julia Hart");
			contentString = contentString.replace(".@thejuliahart","Julia Hart");
			contentString = contentString.replace("@TheKipSabian","Kip Sabian");
			contentString = contentString.replace("@ThePenelopeFord","Penelope Ford");
			contentString = contentString.replace("@thePenelopeFord","Penelope Ford");
			contentString = contentString.replace("@thekaun","Bishop Kaun");
			contentString = contentString.replace("@TheKaun","Bishop Kaun");
			contentString = contentString.replace("@TopFlight612","Top Flight");
			contentString = contentString.replace(".@TopFlight612","Top Flight");
			contentString = contentString.replace("@Toxic_Thekla","Thekla");
			contentString = contentString.replace("@toxic_thekla","Thekla");
			contentString = contentString.replace(".@Toxic_Thekla","Thekla");
			contentString = contentString.replace(".@toxic_thekla","Thekla");
			contentString = contentString.replace("@TOXIC_THEKLA","THEKLA");
			contentString = contentString.replace("@ToaLiona","Toa Liona");
			contentString = contentString.replace(".@ToaLiona","Toa Liona");
			contentString = contentString.replace("@toaliona","Toa Liona");
			contentString = contentString.replace(".@toaliona","Toa Liona");
			contentString = contentString.replace("@TrueWillieHobbs","Powerhouse Hobbs");
			contentString = contentString.replace("@Triller_TV","Triller");
			contentString = contentString.replace("@TonyKhan","Tony Khan");
			contentString = contentString.replace("@Walking_Weapon","Josh Alexander");
			contentString = contentString.replace("@WillowWrestles","Willow Nightingale");
			contentString = contentString.replace(".@WillowWrestles","Willow Nightingale");
			contentString = contentString.replace("@willowwrestles","Willow Nightingale");
			contentString = contentString.replace(".@willowwrestles","Willow Nightingale");
			contentString = contentString.replace("@YoungBucks","Young Bucks");
			contentString = contentString.replace("@youngbucks","Young Bucks");
			contentString = contentString.replace("@_ReyHechicero","Hechicero");
			contentString = contentString.replace("@SNM_Buddy","Buddy Matthews");
			contentString = contentString.replace("@BigShottyLee","Lee Johnson");
			contentString = contentString.replace(".@BigShottyLee","Lee Johnson");
			contentString = contentString.replace("@bigshottylee","Lee Johnson");
			contentString = contentString.replace(".@bigshottylee","Lee Johnson");
			contentString = contentString.replace("@_BlakeChristian","Blake Christian");
			contentString = contentString.replace("@_blakechristian","Blake Christian");
			contentString = contentString.replace(".@_blakechristian","Blake Christian");
			contentString = contentString.replace(".@_BlakeChristian","Blake Christian");
			contentString = contentString.replace("@carliebravo","Carlie Bravo");
			contentString = contentString.replace("@facdaniels","Christopher Daniels");
			contentString = contentString.replace("@SexyChuckieT","Chuck Taylor");
			contentString = contentString.replace("@ClaudioCSRO","Claudio Castagnoli");
			contentString = contentString.replace(".@ClaudioCSRO","Claudio Castagnoli");
			contentString = contentString.replace("@coltengunn","Colten Gunn");
			contentString = contentString.replace("@theDALTONcastle","Dalton Castle");
			contentString = contentString.replace("@DariusMartin612","Darius Martin");
			contentString = contentString.replace("@DiamanteLAX","Diamante");
			contentString = contentString.replace("@realbrittbaker","Britt Baker");
			contentString = contentString.replace("@DRALISTICO_LFI","Dralístico");
			contentString = contentString.replace("@dustinrhodes","Dustin Rhodes");
			contentString = contentString.replace("@EmiSakura_gtmv","Emi Sakura");
			contentString = contentString.replace("@EvilUno","Evil Uno");
			contentString = contentString.replace("@ShutUpExcalibur","Excalibur");
			contentString = contentString.replace("@AEWHologram","Hologram");
			contentString = contentString.replace(".@AEWHologram","Hologram");
			contentString = contentString.replace("@730hook","HOOK");
			contentString = contentString.replace(".@730hook","HOOK");
			contentString = contentString.replace("@ianriccaboni","Ian Riccaboni");
			contentString = contentString.replace("@boy_myth_legend","Jack Perry");
			contentString = contentString.replace("@boymythlegend","Jack Perry");
			contentString = contentString.replace(".@boy_myth_legend","Jack Perry");
			contentString = contentString.replace(".@boymythlegend","Jack Perry");
			contentString = contentString.replace("@TheLethalJay","Jay Lethal");
			contentString = contentString.replace("@jaywhitenz","Jay White");
			contentString = contentString.replace("@RealJeffJarrett","Jeff Jarrett");
			contentString = contentString.replace("@JRsBBQ","Jim Ross");
			contentString = contentString.replace("@KennyOmegamanX","Kenny Omega");
			contentString = contentString.replace(".@KennyOmegamanX","Kenny Omega");
			contentString = contentString.replace("@KomandercrMX","Komander");
			contentString = contentString.replace(".@KomandercrMX","Komander");
			contentString = contentString.replace("@ibushi_kota","Kota Ibushi");
			contentString = contentString.replace("@KORcombat","Kyle O'Reilly");
			contentString = contentString.replace(".@KORcombat","Kyle O'Reilly");
			contentString = contentString.replace("@LanceHoyt","Lance Archer");
			contentString = contentString.replace("@RasselinDoc","Luther");
			contentString = contentString.replace("@MarinaShafir","Marina Shafir");
			contentString = contentString.replace("@dunkzilladavis","Mark Davis");
			contentString = contentString.replace("@theDaddyMagic","Daddy Magic");
			contentString = contentString.replace(".@theDaddyMagic","Daddy Magic");
			contentString = contentString.replace("@McGuinnessNigel","Nigel McGuinness");
			contentString = contentString.replace("@orangecassidy","Orange Cassidy");
			contentString = contentString.replace(".@orangecassidy","Orange Cassidy");
			contentString = contentString.replace("@bastardpac","PAC");
			contentString = contentString.replace("@PrinceKingNana","Prince Nana");
			contentString = contentString.replace("@RJCity1","RJ City");
			contentString = contentString.replace("@realrubysoho","Ruby Soho");
			contentString = contentString.replace("@sammyguevara","Sammy Guevara");
			contentString = contentString.replace("@swerveconfident","Swerve Strickland");
			contentString = contentString.replace("@ThunderRosa22","Thunder Rosa");
			contentString = contentString.replace("@tonyschiavone24","Tony Schiavone");
			contentString = contentString.replace("@Trentylocks","Trent Beretta");
			contentString = contentString.replace("@TruthMagnum","Truth Magnum");
			contentString = contentString.replace("@turbofloyd_","Turbo Floyd");
			contentString = contentString.replace("@bountykeith","Bryan Keith");
			contentString = contentString.replace(".@bountykeith","Bryan Keith");
			contentString = contentString.replace("@briancagegmsi","Brian Cage");
			contentString = contentString.replace("@WheelerYuta","Wheeler Yuta");
			contentString = contentString.replace(".@WheelerYuta","Wheeler Yuta");
			contentString = contentString.replace("Happy Birthday! Darius Martin","Happy Birthday Darius Martin!");
			contentString = contentString.replace("@Sting","Sting");
			contentString = contentString.replace("@theleemoriarty","Lee Moriarty");
			contentString = contentString.replace("@Ortiz_Powerful","Ortiz");
			contentString = contentString.replace("Happy Birthday! @SNM_Buddy","Happy Birthday Buddy Matthews!");
			contentString = contentString.replace("Happy Birthday! Buddy Matthews","Happy Birthday Buddy Matthews!");
			contentString = contentString.replace("Happy Birthday! @Ortiz_Powerful","Happy Birthday Ortiz!");
			contentString = contentString.replace("Happy Birthday! Ortiz","Happy Birthday Ortiz!");
			
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
