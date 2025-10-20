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

		if (contentString.includes("@_blakechristian")
        	|| contentString.includes("@_BlakeChristian")
        	|| contentString.includes("@_ReyHechicero")
			|| contentString.includes("@_ReyHecicero")
        	|| contentString.includes("@730hook")
			|| contentString.includes("@aaron_solo_") 
        	|| contentString.includes("@actionandretti")
        	|| contentString.includes("@ActionAndretti")
        	|| contentString.includes("@adamcolepro")
        	|| contentString.includes("@AdamColePro")
			|| contentString.includes("@adam_priest")
			|| contentString.includes("@Adam_Priest_")
        	|| contentString.includes("@AEWHologram")
        	|| contentString.includes("@ajbefumo")
        	|| contentString.includes("@Amisylle")
        	|| contentString.includes("@AndradeElIdolo")
        	|| contentString.includes("@Angelico_AEW")
        	|| contentString.includes("@annajay___")
        	|| contentString.includes("@AnthonyOgogo")
        	|| contentString.includes("@Antnyhenry")
        	|| contentString.includes("@AntnyHenry")  
        	|| contentString.includes("@ARealFoxx")
        	|| contentString.includes("@AthenaPalmer_FG")
        	|| contentString.includes("@azucarRoc")
        	|| contentString.includes("@bandidowrestler")
        	|| contentString.includes("@BandidoWrestler")
        	|| contentString.includes("@bastardpac")
			|| contentString.includes("@BASTARDPAC")
        	|| contentString.includes("@BeastMortos")
        	|| contentString.includes("@bigshottylee")
        	|| contentString.includes("@BigShottyLee")
			|| contentString.includes("@billiestarkz")
        	|| contentString.includes("@Billingtons22")
        	|| contentString.includes("@bountykeith")
        	|| contentString.includes("@Bowens_Official")
        	|| contentString.includes("@boy_myth_legend")
        	|| contentString.includes("@boymythlegend")
        	|| contentString.includes("@BranCutler")
        	|| contentString.includes("@briancagegmsi")
        	|| contentString.includes("@Brodyxking")  
        	|| contentString.includes("@BrodyXKing")  
        	|| contentString.includes("@bryandanielson")
        	|| contentString.includes("@BryanDanielson")  
        	|| contentString.includes("@callmekrisstat")
        	|| contentString.includes("@CallMeKrisStat")
        	|| contentString.includes("@carliebravo")
        	|| contentString.includes("@CarlieBravo")
        	|| contentString.includes("@CashWheelerFTR")
			|| contentString.includes("@CDArenaKC")
         	|| contentString.includes("@Christian4Peeps")  
        	|| contentString.includes("@ClaudioCSRO")
        	|| contentString.includes("@CMLL_OFICIAL")  
			|| contentString.includes("@CNN")  
        	|| contentString.includes("@coltengunn")
        	|| contentString.includes("@dabryceisright")
			|| contentString.includes("@dailysplace")
        	|| contentString.includes("@DarbyAllin")
        	|| contentString.includes("@DARBYALLIN")
        	|| contentString.includes("@DariusMartin612")
        	|| contentString.includes("@DaxFTR")  
        	|| contentString.includes("@DCOfficial")
        	|| contentString.includes("@DeonnaPurrazzo")
        	|| contentString.includes("@DiamanteLAX")
        	|| contentString.includes("@DRALISTICO_LFI")
        	|| contentString.includes("@dunkzilladavis")
			|| contentString.includes("@DUNKZILLADavis")
        	|| contentString.includes("@dustinrhodes")
        	|| contentString.includes("@EmiSakura_gtmv")
			|| contentString.includes("@EverBankStadium")
        	|| contentString.includes("@EvilUno")
        	|| contentString.includes("@facdaniels")
        	|| contentString.includes("@fightbobby")
        	|| contentString.includes("@FightBobby")  
        	|| contentString.includes("@hailwindsor")
        	|| contentString.includes("@HailWindsor")
        	|| contentString.includes("@harleycameron_")  
        	|| contentString.includes("@HarleyCameron_")  
         	|| contentString.includes("@HBOMax")  
        	|| contentString.includes("@IAmJericho")  
        	|| contentString.includes("@ianriccaboni")
        	|| contentString.includes("@ibushi_kota")
        	|| contentString.includes("@itsjerrylynn")  
			|| contentString.includes("@Jaguars")  
        	|| contentString.includes("@jaywhitenz")
			|| contentString.includes("@JayWhiteNZ")
        	|| contentString.includes("@Jet2Flyy")  
        	|| contentString.includes("@JmeHytr")
        	|| contentString.includes("@jmehytr")  
        	|| contentString.includes("@JonMoxley")
        	|| contentString.includes("@JRsBBQ")
        	|| contentString.includes("@K_Shibata2022")
        	|| contentString.includes("@KennyOmegamanX")
        	|| contentString.includes("@KingRicochet")  
			|| contentString.includes("@KingSerpentico") 
        	|| contentString.includes("@KomandercrMX")
        	|| contentString.includes("@KORcombat")
        	|| contentString.includes("@kylefletcherpro")
        	|| contentString.includes("@KyleFletcherPro")  
        	|| contentString.includes("@LanceHoyt")
        	|| contentString.includes("@Lucha_Angel1")
        	|| contentString.includes("@luchasaurus")
        	|| contentString.includes("@MarinaShafir")
        	|| contentString.includes("@MascaraDoradMD")
        	|| contentString.includes("@McGuinnessNigel")
        	|| contentString.includes("@meganbayne")  
        	|| contentString.includes("@MeganBayne")  
        	|| contentString.includes("@MercedesVarnado")
        	|| contentString.includes("@MinaShirakawa")
			|| contentString.includes("@MichaelNakazawa")
        	|| contentString.includes("@MotherAEW")  
        	|| contentString.includes("@orangecassidy")
        	|| contentString.includes("@Ortiz_Powerful")
        	|| contentString.includes("@PlatinumMax")
        	|| contentString.includes("@ppv_com")  
        	|| contentString.includes("@PrimeVideo")  
        	|| contentString.includes("@PrinceKingNana")
        	|| contentString.includes("@rainmakerXokada")  
        	|| contentString.includes("@RainmakerXOkada")  
        	|| contentString.includes("@RasselinDoc")
        	|| contentString.includes("@RatedRCope")
        	|| contentString.includes("@RealBillyGunn")
        	|| contentString.includes("@realbrittbaker")
        	|| contentString.includes("@RealBrittBaker")    
        	|| contentString.includes("@RealJDDrake")  
        	|| contentString.includes("@RealJeffJarrett")
        	|| contentString.includes("@realrubysoho")
        	|| contentString.includes("@refaubrey")
        	|| contentString.includes("@RefAubrey")
        	|| contentString.includes("@ReneePaquette") 
			|| contentString.includes("@ringofhonor")
        	|| contentString.includes("@RJCity1")
        	|| contentString.includes("@roderickstrong")
        	|| contentString.includes("@RoderickStrong")  
			|| contentString.includes("@rushtoroblanco")
        	|| contentString.includes("@sammyguevara")
        	|| contentString.includes("@SamoaJoe")
        	|| contentString.includes("@samoajoe")  
        	|| contentString.includes("@Sareee_official")
        	|| contentString.includes("@SexyChuckieT")
        	|| contentString.includes("@Shane216Taylor")
        	|| contentString.includes("@ShawnDean773")
        	|| contentString.includes("@SheltyB803")  
        	|| contentString.includes("@shidahikaru")
        	|| contentString.includes("@ShidaHikaru")
			|| contentString.includes("@ShopAEW")
        	|| contentString.includes("@ShutUpExcalibur")
        	|| contentString.includes("@Skyebyee")  
        	|| contentString.includes("@SkyeByee")  
        	|| contentString.includes("@SNM_Buddy")
        	|| contentString.includes("@SpeedballBailey")  
        	|| contentString.includes("@SportsonMax")
        	|| contentString.includes("@Sting")
        	|| contentString.includes("@SussexCoChicken")
        	|| contentString.includes("@swerveconfident")
        	|| contentString.includes("@takesoup")  
        	|| contentString.includes("@Takesoup")  
        	|| contentString.includes("@taymelo")
        	|| contentString.includes("@TBSNetwork")
        	|| contentString.includes("@the_ace_austin")
        	|| contentString.includes("@The_Ace_Austin")
        	|| contentString.includes("@The_MJF")
        	|| contentString.includes("@The305MVP")  
        	|| contentString.includes("@TheAngeloParker")
        	|| contentString.includes("@theaustingunn")
        	|| contentString.includes("@TheCaZXL")
        	|| contentString.includes("@theDaddyMagic")
        	|| contentString.includes("@theDALTONcastle")
        	|| contentString.includes("@TheDonCallis")  
        	|| contentString.includes("@TheJuliaHart")
        	|| contentString.includes("@thejuliahart")  
        	|| contentString.includes("@thekaun")  
        	|| contentString.includes("@TheKaun")  
        	|| contentString.includes("@TheKipSabian")  
        	|| contentString.includes("@theleemoriarty")
        	|| contentString.includes("@theLeeMoriarty")
        	|| contentString.includes("@TheLethalJay")
        	|| contentString.includes("@thenickwayne")
        	|| contentString.includes("@thePenelopeFord")  
        	|| contentString.includes("@ThePenelopeFord") 
			|| contentString.includes("@TheRealMorrison") 
			|| contentString.includes("@therealmorrison") 
        	|| contentString.includes("@thunderrosa22")
        	|| contentString.includes("@ThunderRosa22")
        	|| contentString.includes("@tntdrama")
        	|| contentString.includes("@TNTdrama")
        	|| contentString.includes("@TNTDrama")
			|| contentString.includes("@TNTNetwork")
        	|| contentString.includes("@ToaLiona")
        	|| contentString.includes("@TonyKhan")  
        	|| contentString.includes("@tonyschiavone24")
        	|| contentString.includes("@TopFlight612")
        	|| contentString.includes("@TOXIC_THEKLA")
        	|| contentString.includes("@toxic_thekla")  
        	|| contentString.includes("@Toxic_Thekla")  
        	|| contentString.includes("@trentylocks")
        	|| contentString.includes("@Trentylocks")
        	|| contentString.includes("@Triller_TV")  
        	|| contentString.includes("@TrueWillieHobbs")  
        	|| contentString.includes("@TruthMagnum")
        	|| contentString.includes("@turbofloyd_")
        	|| contentString.includes("@Walking_Weapon")  
        	|| contentString.includes("@WheelerYuta")
        	|| contentString.includes("@WillOspreay")
        	|| contentString.includes("@willowwrestles")  
        	|| contentString.includes("@WillowWrestles") 
			|| contentString.includes("@Xbox")
			|| contentString.includes("@xbox") 
        	|| contentString.includes("@youngbucks")
        	|| contentString.includes("@YoungBucks")
			|| contentString.includes("@thetayavalkyrie")
		    || contentString.includes("@TheRealMorrison")
		    || contentString.includes("@GREATBLACKOTAKU")
		    || contentString.includes("@suavemansoor")
			|| contentString.includes("@zacksabrejr")
			|| contentString.includes("@njpwworld")
			|| contentString.includes("@WillWashington")
		    || contentString.includes("Happy Birthday! @DariusMartin612")
			|| contentString.includes("Happy Birthday! @SNM_Buddy")
			|| contentString.includes("Happy Birthday! @Ortiz_Powerful")
			|| contentString.includes("Happy Birthday! @Ariel_Levy")
			|| contentString.includes("Happy Birthday! @rushtoroblanco")
		
		   )
		{
			contentString = contentString.replace("@_blakechristian","Blake Christian");
			contentString = contentString.replace("@_BlakeChristian","Blake Christian");
			contentString = contentString.replace("@_ReyHechicero","Hechicero");
			contentString = contentString.replace("@_ReyHecicero","Hechicero");
			contentString = contentString.replace("@730hook","HOOK");
			contentString = contentString.replace("@aaron_solo_","Aaron Solo");
			contentString = contentString.replace("@actionandretti","Action Andretti");
			contentString = contentString.replace("@ActionAndretti","Action Andretti");
			contentString = contentString.replace("@adamcolepro","Adam Cole");
			contentString = contentString.replace("@AdamColePro","Adam Cole");
			contentString = contentString.replace("@adam_priest","Adam Priest");
			contentString = contentString.replace("@Adam_Priest_","Adam Priest");
			contentString = contentString.replace("@AEWHologram","Hologram");
			contentString = contentString.replace("@ajbefumo","Big Boom AJ");
			contentString = contentString.replace("@amisylle","Queen Aminata");
			contentString = contentString.replace("@Amisylle","Queen Aminata");
			contentString = contentString.replace("@AndradeElIdolo","Andrade");
			contentString = contentString.replace("@Angelico_AEW","Angelico");
			contentString = contentString.replace("@annajay___","Anna Jay");
			contentString = contentString.replace("@AnthonyOgogo","Anthony Ogogo");
			contentString = contentString.replace("@Antnyhenry","Anthony Henry");
			contentString = contentString.replace("@ARealFoxx","AR Fox");
			contentString = contentString.replace("@Ariel_Levy","Ariel Levy");
			contentString = contentString.replace("@AthenaPalmer_FG","Athena");
			contentString = contentString.replace("@azucarRoc","Rocky Romero");
			contentString = contentString.replace("@bandidowrestler","Bandido");
			contentString = contentString.replace("@BandidoWrestler","Bandido");
			contentString = contentString.replace("@bastardpac","PAC");
			contentString = contentString.replace("@BASTARDPAC","PAC");
			contentString = contentString.replace("@BeastMortos","Beast Mortos");
			contentString = contentString.replace("@bigshottylee","Lee Johnson");
			contentString = contentString.replace("@BigShottyLee","Lee Johnson");
			contentString = contentString.replace("@billiestarkz","Billie Starkz");
			contentString = contentString.replace("@Billingtons22","Tommy Billington");
			contentString = contentString.replace("@bountykeith","Bryan Keith");
			contentString = contentString.replace("@Bowens_Official","Anthony Bowens");
			contentString = contentString.replace("@boy_myth_legend","Jack Perry");
			contentString = contentString.replace("@boymythlegend","Jack Perry");
			contentString = contentString.replace("@briancagegmsi","Brian Cage");
			contentString = contentString.replace("@Brodyxking","Brody King");
			contentString = contentString.replace("@BrodyXKing","Brody King");
			contentString = contentString.replace("@bryandanielson","Bryan Danielson");
			contentString = contentString.replace("@BryanDanielson","Bryan Danielson");
			contentString = contentString.replace("@callmekris@twitter.com Stat","Kris Statlander");
			contentString = contentString.replace("@callmekris Stat","Kris Statlander");
			contentString = contentString.replace("@callmekrisstat","Kris Statlander");
			contentString = contentString.replace("@CallMeKrisStat","Kris Statlander");
			contentString = contentString.replace("@carliebravo","Carlie Bravo");
			contentString = contentString.replace("@CarlieBravo","Carlie Bravo");
			contentString = contentString.replace("@CashWheelerFTR","Cash Wheeler");
			contentString = contentString.replace("@CDArenaKC","Cable Dahmer Arena");
			contentString = contentString.replace("@Christian4Peeps","Christian Cage");
			contentString = contentString.replace("@ClaudioCSRO","Claudio Castagnoli");
			contentString = contentString.replace("@CMLL_OFICIAL","CMLL");
			contentString = contentString.replace("@CNN","CNN");
			contentString = contentString.replace("@coltengunn","Colten Gunn");
			contentString = contentString.replace("@dabryceisright","Bryce Remsburg");
			contentString = contentString.replace("! @dailysplace"," at Daily's Place!");
			contentString = contentString.replace("@dailysplace","Daily's Place");
			contentString = contentString.replace("@DarbyAllin","Darby Allin");
			contentString = contentString.replace("@DARBYALLIN","DARBY ALLIN");
			contentString = contentString.replace("@DariusMartin612","Darius Martin");
			contentString = contentString.replace("@DaxFTR","Dax Harwood");
			contentString = contentString.replace("@DCOfficial","DC");
			contentString = contentString.replace("@DiamanteLAX","Diamante");
			contentString = contentString.replace("@DRALISTICO_LFI","Dralístico");
			contentString = contentString.replace("@dunkzilladavis","Mark Davis");
			contentString = contentString.replace("@DUNKZILLADavis","Mark Davis");
			contentString = contentString.replace("@dustinrhodes","Dustin Rhodes");
			contentString = contentString.replace("@EmiSakura_gtmv","Emi Sakura");
			contentString = contentString.replace("@EverBankStadium","EverBank Stadium");
			contentString = contentString.replace("@EvilUno","Evil Uno");
			contentString = contentString.replace("@facdaniels","Christopher Daniels");
			contentString = contentString.replace("@fightbobby","Bobby Lashley");
			contentString = contentString.replace("@FightBobby","Bobby Lashley");
			contentString = contentString.replace("@hailwindsor","Alex Windsor");
			contentString = contentString.replace("@HailWindsor","Alex Windsor");
			contentString = contentString.replace("@harleycameron_","Harley Cameron");
			contentString = contentString.replace("@HarleyCameron_","Harley Cameron");
			contentString = contentString.replace("@HBOMax","HBO Max");
			contentString = contentString.replace("@IAmJericho","Chris Jericho");
			contentString = contentString.replace("@ianriccaboni","Ian Riccaboni");
			contentString = contentString.replace("@ibushi_kota","Kota Ibushi");
			contentString = contentString.replace("@itsjerrylynn","Jerry Lynn");
			contentString = contentString.replace("@Jaguars","Jaguars");
			contentString = contentString.replace("@jaywhitenz","Jay White");
			contentString = contentString.replace("@Jet2Flyy","Kevin Knight");
			contentString = contentString.replace("@jmehytr","Jamie Hayter");
			contentString = contentString.replace("@JmeHytr","Jamie Hayter");
			contentString = contentString.replace("@JonMoxley","Jon Moxley");
			contentString = contentString.replace("@JRsBBQ","Jim Ross");
			contentString = contentString.replace("@K_Shibata2022","Katsuyori Shibata");
			contentString = contentString.replace("@KennyOmegamanX","Kenny Omega");
			contentString = contentString.replace("@KingRicochet","Ricochet");
			contentString = contentString.replace("@KingSerpentico","Serpentico");
			contentString = contentString.replace("@KomandercrMX","Komander");
			contentString = contentString.replace("@KORcombat","Kyle O'Reilly");
			contentString = contentString.replace("@kylefletcherpro","Kyle Fletcher");
			contentString = contentString.replace("@KyleFletcherPro","Kyle Fletcher");
			contentString = contentString.replace("@LanceHoyt","Lance Archer");
			contentString = contentString.replace("@Lucha_Angel1","Dante Martin");
			contentString = contentString.replace("@luchasaurus","Luchasaurus");
			contentString = contentString.replace("@MarinaShafir","Marina Shafir");
			contentString = contentString.replace("@MascaraDoradMD","Máscara Dorada");
			contentString = contentString.replace("@McGuinnessNigel","Nigel McGuinness");
			contentString = contentString.replace("@meganbayne","Megan Bayne");
			contentString = contentString.replace("@MeganBayne","Megan Bayne");
			contentString = contentString.replace("@MercedesVarnado","Mercedes Moné");
			contentString = contentString.replace("@MinaShirakawa","Mina Shirakawa");
			contentString = contentString.replace("@MichaelNakazawa","Michael Nakazawa");
			contentString = contentString.replace("@MotherAEW","Mother Wayne");
			contentString = contentString.replace("@orangecassidy","Orange Cassidy");
			contentString = contentString.replace("@Ortiz_Powerful","Ortiz");
			contentString = contentString.replace("@PlatinumMax","Max Caster");
			contentString = contentString.replace("@ppv_com","PPV.com");
			contentString = contentString.replace("@PrimeVideo","Prime Video");
			contentString = contentString.replace("@PrinceKingNana","Prince Nana");
			contentString = contentString.replace("@rainmakerXokada","Kazuchika Okada");
			contentString = contentString.replace("@RainmakerXOkada","Kazuchika Okada");
			contentString = contentString.replace("@RasselinDoc","Luther");
			contentString = contentString.replace("@RatedRCope","Adam Copeland");
			contentString = contentString.replace("@realbrittbaker","Britt Baker");
			contentString = contentString.replace("@RealBrittBaker","Britt Baker");
			contentString = contentString.replace("@RealJDDrake","JD Drake");
			contentString = contentString.replace("@RealJeffJarrett","Jeff Jarrett");
			contentString = contentString.replace("@realrubysoho","Ruby Soho");
			contentString = contentString.replace("@refaubrey","Aubrey Edwards");
			contentString = contentString.replace("@RefAubrey","Aubrey Edwards");
			contentString = contentString.replace("@ReneePaquette","Renee Paquette");
			contentString = contentString.replace("@ringofhonor","Ring of Honor");
			contentString = contentString.replace("@RJCity1","RJ City");
			contentString = contentString.replace("@roderickstrong","Roderick Strong");
			contentString = contentString.replace("@RoderickStrong","Roderick Strong");
			contentString = contentString.replace("@rushtoroblanco","RUSH");
			contentString = contentString.replace("@sammyguevara","Sammy Guevara");
			contentString = contentString.replace("@SamoaJoe","Samoa Joe");
			contentString = contentString.replace("@Sareee_official","Sareee");
			contentString = contentString.replace("@SexyChuckieT","Chuck Taylor");
			contentString = contentString.replace("@ShawnDean773","Shawn Dean");
			contentString = contentString.replace("@Sheltyb803","Shelton Benjamin");
			contentString = contentString.replace("@SheltyB803","Shelton Benjamin");
			contentString = contentString.replace("@shidahikaru","Hikaru Shida");
			contentString = contentString.replace("@ShidaHikaru","Hikaru Shida");
			contentString = contentString.replace("@ShopAEW","ShopAEW.com");
			contentString = contentString.replace("@ShutUpExcalibur","Excalibur");
			contentString = contentString.replace("@Skyebyee","Skye Blue");
			contentString = contentString.replace("@SkyeByee","Skye Blue");
			contentString = contentString.replace("@SNM_Buddy","Buddy Matthews");
			contentString = contentString.replace("@SpeedballBailey","Speedball Mike Bailey");
			contentString = contentString.replace("@SportsonMax","HBO Max");
			contentString = contentString.replace("@SportsonMax","HBO Max");
			contentString = contentString.replace("@Sting","Sting");
			contentString = contentString.replace("@SussexCoChicken","Mark Briscoe");
			contentString = contentString.replace("@swerveconfident","Swerve Strickland");
			contentString = contentString.replace("@takesoup","Konosuke Takeshita");
			contentString = contentString.replace("@Takesoup","Konosuke Takeshita");
			contentString = contentString.replace("@taymelo","Tay Melo");
			contentString = contentString.replace("@TBSNetwork","TBS");
			contentString = contentString.replace("@the_ace_austin","Ace Austin");
			contentString = contentString.replace("@The_Ace_Austin","Ace Austin");
			contentString = contentString.replace("@The_MJF","MJF");
			contentString = contentString.replace("@The305MVP","MVP");
			contentString = contentString.replace("@TheAngeloParker","Angelo Parker");
			contentString = contentString.replace("@theaustingunn","Austin Gunn");
			contentString = contentString.replace("@TheCaZXL","Big Bill");
			contentString = contentString.replace("@theDaddyMagic","Daddy Magic");
			contentString = contentString.replace("@theDALTONcastle","Dalton Castle");
			contentString = contentString.replace("@TheDonCallis","Don Callis");
			contentString = contentString.replace("@thejuliahart","Julia Hart");
			contentString = contentString.replace("@TheJuliaHart","Julia Hart");
			contentString = contentString.replace("@thekaun","Bishop Kaun");
			contentString = contentString.replace("@TheKaun","Bishop Kaun");
			contentString = contentString.replace("@TheKipSabian","Kip Sabian");
			contentString = contentString.replace("@theleemoriarty","Lee Moriarty");
			contentString = contentString.replace("@TheLethalJay","Jay Lethal");
			contentString = contentString.replace("@thenickwayne","Nick Wayne");
			contentString = contentString.replace("@thePenelopeFord","Penelope Ford");
			contentString = contentString.replace("@ThePenelopeFord","Penelope Ford");
			contentString = contentString.replace("@TheRealMorrison","Johnny TV");
			contentString = contentString.replace("@therealmorrison","Johnny TV");
			contentString = contentString.replace("@thunderrosa22","Thunder Rosa");
			contentString = contentString.replace("@ThunderRosa22","Thunder Rosa");
			contentString = contentString.replace("@tntdrama","TNT");
			contentString = contentString.replace("@TNTdrama","TNT");
			contentString = contentString.replace("@TNTNetwork","TNT");
			contentString = contentString.replace("@toaliona","Toa Liona");
			contentString = contentString.replace("@ToaLiona","Toa Liona");
			contentString = contentString.replace("@TonyKhan","Tony Khan");
			contentString = contentString.replace("@tonyschiavone24","Tony Schiavone");
			contentString = contentString.replace("@TopFlight612","Top Flight");
			contentString = contentString.replace("@toxic_thekla","Thekla");
			contentString = contentString.replace("@Toxic_Thekla","Thekla");
			contentString = contentString.replace("@TOXIC_THEKLA","THEKLA");
			contentString = contentString.replace("@trentylocks","Trent Beretta");
			contentString = contentString.replace("@Trentylocks","Trent Beretta");
			contentString = contentString.replace("@Triller_TV","Triller");
			contentString = contentString.replace("@TrueWillieHobbs","Powerhouse Hobbs");
			contentString = contentString.replace("@TruthMagnum","Truth Magnum");
			contentString = contentString.replace("@turbofloyd_","Turbo Floyd");
			contentString = contentString.replace("@Walking_Weapon","Josh Alexander");
			contentString = contentString.replace("@WheelerYuta","Wheeler Yuta");
			contentString = contentString.replace("@WillOspreay","Will Ospreay");
			contentString = contentString.replace("@willowwrestles","Willow Nightingale");
			contentString = contentString.replace("@WillowWrestles","Willow Nightingale");
			contentString = contentString.replace("@Xbox","Xbox");
			contentString = contentString.replace("@Xbox","Xbox");
			contentString = contentString.replace("@xbox","Xbox");
			contentString = contentString.replace("@youngbucks","Young Bucks");
			contentString = contentString.replace("@YoungBucks","Young Bucks");
			contentString = contentString.replace("@thetayavalkyrie","Taya Valkyrie");
			contentString = contentString.replace("@TheRealMorrison","Johnny TV");
			contentString = contentString.replace("@GREATBLACKOTAKU","Mason Madden");
			contentString = contentString.replace("@suavemansoor","Mansoor");
			contentString = contentString.replace("@zacksabrejr","Zack Sabre Jr.");
			contentString = contentString.replace("@njpwworld","NJPW World");
			contentString = contentString.replace("@WillWashington","Will Washington");
			contentString = contentString.replace("@callmekris Stat","Kris Statlander")
			contentString = contentString.replace(".Blake Christian","Blake Christian");
			contentString = contentString.replace(".Hechicero","Hechicero");
			contentString = contentString.replace(".HOOK","HOOK");
			contentString = contentString.replace(".Aaron Solo","Aaron Solo");
			contentString = contentString.replace(".Action Andretti","Action Andretti");
			contentString = contentString.replace(".Adam Cole","Adam Cole");
			contentString = contentString.replace(".Adam Priest","Adam Priest");
			contentString = contentString.replace(".Hologram","Hologram");
			contentString = contentString.replace(".Big Boom AJ","Big Boom AJ");
			contentString = contentString.replace(".Queen Aminata","Queen Aminata");
			contentString = contentString.replace(".Andrade","Andrade");
			contentString = contentString.replace(".Angelico","Angelico");
			contentString = contentString.replace(".Anna Jay","Anna Jay");
			contentString = contentString.replace(".Anthony Ogogo","Anthony Ogogo");
			contentString = contentString.replace(".Anthony Henry","Anthony Henry");
			contentString = contentString.replace(".AR Fox","AR Fox");
			contentString = contentString.replace(".Ariel Levy","Ariel Levy");
			contentString = contentString.replace(".Athena","Athena");
			contentString = contentString.replace(".Rocky Romero","Rocky Romero");
			contentString = contentString.replace(".bandidowrestler","Bandido");
			contentString = contentString.replace(".Bandido","Bandido");
			contentString = contentString.replace(".PAC","PAC");
			contentString = contentString.replace(".Beast Mortos","Beast Mortos");
			contentString = contentString.replace(".Lee Johnson","Lee Johnson");
			contentString = contentString.replace(".Billie Starkz","Billie Starkz");
			contentString = contentString.replace(".Bryan Keith","Bryan Keith");
			contentString = contentString.replace(".Anthony Bowens","Anthony Bowens");
			contentString = contentString.replace(".Jack Perry","Jack Perry");
			contentString = contentString.replace(".Brian Cage","Brian Cage");
			contentString = contentString.replace(".Brody King","Brody King");
			contentString = contentString.replace(".Bryan Danielson","Bryan Danielson");
			contentString = contentString.replace(".Kris Statlander","Kris Statlander");
			contentString = contentString.replace(".Carlie Bravo","Carlie Bravo");
			contentString = contentString.replace(".Cash Wheeler","Cash Wheeler");
			contentString = contentString.replace(".Christian4Christian CagePeeps","Christian Cage");
			contentString = contentString.replace(".Claudio Castagnoli","Claudio Castagnoli");
			contentString = contentString.replace(".CMLL","CMLL");
			contentString = contentString.replace(".Colten Gunn","Colten Gunn");
			contentString = contentString.replace(".Darby Allin","Darby Allin");
			contentString = contentString.replace(".DARBY ALLIN","DARBY ALLIN");
			contentString = contentString.replace(".Darius Martin","Darius Martin");
			contentString = contentString.replace(".Dax Harwood","Dax Harwood");
			contentString = contentString.replace(".DC","DC");
			contentString = contentString.replace(".Diamante","Diamante");
			contentString = contentString.replace(".Dralístico","Dralístico");
			contentString = contentString.replace(".Mark Davis","Mark Davis");
			contentString = contentString.replace(".Dustin Rhodes","Dustin Rhodes");
			contentString = contentString.replace(".Emi Sakura","Emi Sakura");
			contentString = contentString.replace(".Evil Uno","Evil Uno");
			contentString = contentString.replace(".Christopher Daniels","Christopher Daniels");
			contentString = contentString.replace(".Bobby Lashley","Bobby Lashley");
			contentString = contentString.replace(".Alex Windsor","Alex Windsor");
			contentString = contentString.replace(".Harley Cameron","Harley Cameron");
			contentString = contentString.replace(".HBO Max","HBO Max");
			contentString = contentString.replace(".Chris Jericho","Chris Jericho");
			contentString = contentString.replace(".Ian Riccaboni","Ian Riccaboni");
			contentString = contentString.replace(".Kota Ibushi","Kota Ibushi");
			contentString = contentString.replace(".Jerry Lynn","Jerry Lynn");
			contentString = contentString.replace(".Jay White","Jay White");
			contentString = contentString.replace(".Kevin Knight","Kevin Knight");
			contentString = contentString.replace(".Jamie Hayter","Jamie Hayter");
			contentString = contentString.replace(".Jon Moxley","Jon Moxley");
			contentString = contentString.replace(".Jim Ross","Jim Ross");
			contentString = contentString.replace(".Katsuyori Shibata","Shibata");
			contentString = contentString.replace(".Kenny Omega","Kenny Omega");
			contentString = contentString.replace(".Ricochet","Ricochet");
			contentString = contentString.replace(".Komander","Komander");
			contentString = contentString.replace(".Kyle O'Reilly","Kyle O'Reilly");
			contentString = contentString.replace(".Kyle Fletcher","Kyle Fletcher");
			contentString = contentString.replace(".Lance Archer","Lance Archer");
			contentString = contentString.replace(".Dante Martin","Dante Martin");
			contentString = contentString.replace(".Luchasaurus","Luchasaurus");
			contentString = contentString.replace(".Marina Shafir","Marina Shafir");
			contentString = contentString.replace(".Máscara Dorada","Máscara Dorada");
			contentString = contentString.replace(".Nigel McGuinness","Nigel McGuinness");
			contentString = contentString.replace(".Megan Bayne","Megan Bayne");
			contentString = contentString.replace(".Mercedes Moné","Mercedes Moné");
			contentString = contentString.replace(".Mina Shirakawa","Mina Shirakawa");
			contentString = contentString.replace(".Mother Wayne","Mother Wayne");
			contentString = contentString.replace(".Orange Cassidy","Orange Cassidy");
			contentString = contentString.replace(".Ortizl","Ortiz");
			contentString = contentString.replace(".Max Caster","Max Caster");
			contentString = contentString.replace(".PPV.com","PPV.com");
			contentString = contentString.replace(".Prime Video","Prime Video");
			contentString = contentString.replace(".Prince Nana","Prince Nana");
			contentString = contentString.replace(".Kazuchika Okada","Kazuchika Okada");
			contentString = contentString.replace(".RainmakerXOkada","Okada");
			contentString = contentString.replace(".Luther","Luther");
			contentString = contentString.replace(".Adam Copeland","Adam Copeland");
			contentString = contentString.replace(".Britt Bake","Britt Baker");
			contentString = contentString.replace(".JD Drake","JD Drake");
			contentString = contentString.replace(".JeffJarrett","Jeff Jarrett");
			contentString = contentString.replace(".Ruby Soho","Ruby Soho");
			contentString = contentString.replace(".Aubrey Edwards","Aubrey Edwards");
			contentString = contentString.replace(".Renee Paquette","Renee Paquette");
			contentString = contentString.replace(".RJ City","RJ City");
			contentString = contentString.replace(".Roderick Strong","Roderick Strong");
			contentString = contentString.replace(".Sammy Guevara","Sammy Guevara");
			contentString = contentString.replace(".Samoa Joe","Samoa Joe");
			contentString = contentString.replace(".Sareee","Sareee");
			contentString = contentString.replace(".Chuck Taylor","Chuck Taylor");
			contentString = contentString.replace(".Shawn Dean","Shawn Dean");
			contentString = contentString.replace(".Shelton Benjamin","Shelton Benjamin");
			contentString = contentString.replace(".Hikaru Shida","Hikaru Shida");
			contentString = contentString.replace(".Excalibur","Excalibur");
			contentString = contentString.replace(".Skye Blue","Skye Blue");
			contentString = contentString.replace(".Buddy Matthews","Buddy Matthews");
			contentString = contentString.replace(".Speedball Mike Bailey","Speedball Mike Bailey");
			contentString = contentString.replace(".HBO Max","HBO Max");
			contentString = contentString.replace(".Sting","Sting");
			contentString = contentString.replace(".Mark Briscoe","Mark Briscoe");
			contentString = contentString.replace(".Swerve Strickland","Swerve Strickland");
			contentString = contentString.replace(".Konosuke Takeshita","Konosuke Takeshita");
			contentString = contentString.replace(".Tay Melo","Tay Melo");
			contentString = contentString.replace(".TBS","TBS");
			contentString = contentString.replace(".Tommy Billington","Tommy Billington");
			contentString = contentString.replace(".Ace Austin","Ace Austin");
			contentString = contentString.replace(".MJF","MJF");
			contentString = contentString.replace(".MVP","MVP");
			contentString = contentString.replace(".Angelo Parker","Angelo Parker");
			contentString = contentString.replace(".Austin Gunn","Austin Gunn");
			contentString = contentString.replace(".Big Bill","Big Bill");
			contentString = contentString.replace(".Daddy Magic","Daddy Magic");
			contentString = contentString.replace(".Dalton Castle","Dalton Castle");
			contentString = contentString.replace(".Don Callis","Don Callis");
			contentString = contentString.replace(".Julia Hart","Julia Hart");
			contentString = contentString.replace(".Bishop Kaun","Bishop Kaun");
			contentString = contentString.replace(".Kip Sabian","Kip Sabian");
			contentString = contentString.replace(".Lee Moriarty","Lee Moriarty");
			contentString = contentString.replace(".Jay Lethal","Jay Lethal");
			contentString = contentString.replace(".Nick Wayne","Nick Wayne");
			contentString = contentString.replace(".Penelope Ford","Penelope Ford");
			contentString = contentString.replace(".Ring of Honor","Ring of Honor");
			contentString = contentString.replace(".RUSH","RUSH");
			contentString = contentString.replace(".Thunder Rosa","Thunder Rosa");
			contentString = contentString.replace(".TNT","TNT");
			contentString = contentString.replace(".Toa Liona","Toa Liona");
			contentString = contentString.replace(".Tony Khan","Tony Khan");
			contentString = contentString.replace(".Tony Schiavone","Tony Schiavone");
			contentString = contentString.replace(".Top Flight","Top Flight");
			contentString = contentString.replace(".Thekla","Thekla");
			contentString = contentString.replace(".THEKLA","THEKLA");
			contentString = contentString.replace(".Trent Beretta","Trent Beretta");
			contentString = contentString.replace(".Triller","Triller");
			contentString = contentString.replace(".Powerhouse Hobbs","Powerhouse Hobbs");
			contentString = contentString.replace(".Truth Magnum","Truth Magnum");
			contentString = contentString.replace(".Turbo Floyd","Turbo Floyd");
			contentString = contentString.replace(".Josh Alexander","Josh Alexander");
			contentString = contentString.replace(".Wheeler Yuta","Wheeler Yuta");
			contentString = contentString.replace(".Will Ospreay","Will Ospreay");
			contentString = contentString.replace(".Willow Nightingale","Willow Nightingale");
			contentString = contentString.replace(".Young Bucks","Young Bucks");
			contentString = contentString.replace(".Zack Sabre Jr.","Zack Sabre Jr.");
			contentString = contentString.replace("Happy Birthday! @rushtoroblanco","Happy Birthday RUSH!");
			contentString = contentString.replace("Happy Birthday! @SNM_Buddy","Happy Birthday Buddy Matthews!");
			contentString = contentString.replace("Happy Birthday! Buddy Matthews","Happy Birthday Buddy Matthews!");
			contentString = contentString.replace("Happy Birthday! @Ortiz_Powerful","Happy Birthday Ortiz!");
			contentString = contentString.replace("Happy Birthday! Ortiz","Happy Birthday Ortiz!");
			contentString = contentString.replace("Happy Birthday! Ariel Levy","Happy Birthday Ariel Levy!");
			contentString = contentString.replace("Happy Birthday! Swerve Strickland","Happy Birthday Swerve Strickland!");
			contentString = contentString.replace("Happy Birthday! Skye Blue","Happy Birthday Skye Blue!");
			contentString = contentString.replace("Happy Birthday! Johnny TV","Happy Birthday Johnny TV!");
			contentString = contentString.replace("Happy Birthday! Emi Sakura","Happy Birthday Emi Sakura!");
			contentString = contentString.replace("Happy Birthday! @JayWhiteNZ 🎁","Happy Birthday Jay White! 🎁");
			contentString = contentString.replace("Happy Birthday! Jay White 🎁","Happy Birthday Jay White! 🎁");
			contentString = contentString.replace("Happy Birthday! Don Callis 🎁","Happy Birthday Don Callis! 🎁");
			contentString = contentString.replace("Happy Birthday! Michael Nakazawa 🎁","Happy Birthday Michael Nakazawa! 🎁");

			
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
