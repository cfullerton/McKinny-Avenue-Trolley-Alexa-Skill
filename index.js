var Alexa = require('alexa-sdk');
var request = require('request');
const skillName = "Mckinney Avenue Trolley";
function checkTime()
{
   var sundayOff = "00:45";
   var sundayOn = "09:45";
   var sundayOff2 = "22:30";
   var mondayOn = "6:45";
   var mondayOff = "22:30";
   var tuesdayOn = "6:45";
   var tuesdayOff = "22:30";
   var wednesdayOn = "6:45";
   var wednesdayOff = "22:30";
   var thursdayOn = "6:45";
   var thursdayOff = "22:30";
   var fridayOn = "6:45";
   var saturdayOff = "02:45";
   var saturdayOn = "9:45";

   mapOn = true;

   var now = new Date();
   var time = new Date ( 2015 , 1 , 1 , now.getHours() , now.getMinutes() );

   switch ( now.getDay() )
   {
      case 0:
      {
         offTime = sundayOff.split ( ":" );
         offHour = offTime [ 0 ];
         offMinute = offTime [ 1 ];
         offTime = new Date ( 2015 , 1 , 1 , offHour , offMinute );

         off2Time = sundayOff2.split ( ":" );
         off2Hour = off2Time [ 0 ];
         off2Minute = off2Time [ 1 ];
         off2Time = new Date ( 2015 , 1 , 1 , off2Hour , off2Minute );

         onTime = sundayOn.split ( ":" );
         onHour = onTime [ 0 ];
         onMinute = onTime [ 1 ];
         onTime = new Date ( 2015 , 1 , 1 , onHour , onMinute );

         if ( time > offTime && time < onTime ) mapOn = false;
         else if ( time > off2Time ) mapOn = false;
         //mapOn = true;
      }
      break;

      case 1:
      {
         offTime = mondayOff.split ( ":" );
         offHour = offTime [ 0 ];
         offMinute = offTime [ 1 ];
         offTime = new Date ( 2015 , 1 , 1 , offHour , offMinute );
         onTime = mondayOn.split ( ":" );
         onHour = onTime [ 0 ];
         onMinute = onTime [ 1 ];
         onTime = new Date ( 2015 , 1 , 1 , onHour , onMinute );

         if ( time < onTime || time > offTime )
         {
            mapOn = false;
         }
      }
      break;

      case 2:
      {
         offTime = tuesdayOff.split ( ":" );
         offHour = offTime [ 0 ];
         offMinute = offTime [ 1 ];
         offTime = new Date ( 2015 , 1 , 1 , offHour , offMinute );
         onTime = tuesdayOn.split ( ":" );
         onHour = onTime [ 0 ];
         onMinute = onTime [ 1 ];
         onTime = new Date ( 2015 , 1 , 1 , onHour , onMinute );

         if ( time < onTime || time > offTime )
         {
            mapOn = false;
         }
      }
      break;

      case 3:
      {
         offTime = wednesdayOff.split ( ":" );
         offHour = offTime [ 0 ];
         offMinute = offTime [ 1 ];
         offTime = new Date ( 2015 , 1 , 1 , offHour , offMinute );
         onTime = wednesdayOn.split ( ":" );
         onHour = onTime [ 0 ];
         onMinute = onTime [ 1 ];
         onTime = new Date ( 2015 , 1 , 1 , onHour , onMinute );

         if ( time < onTime || time > offTime )
         {
            mapOn = false;
         }
      }
      break;

      case 4:
      {
         offTime = thursdayOff.split ( ":" );
         offHour = offTime [ 0 ];
         offMinute = offTime [ 1 ];
         offTime = new Date ( 2015 , 1 , 1 , offHour , offMinute );
         onTime = thursdayOn.split ( ":" );
         onHour = onTime [ 0 ];
         onMinute = onTime [ 1 ];
         onTime = new Date ( 2015 , 1 , 1 , onHour , onMinute );

         if ( time < onTime || time > offTime )
         {
            mapOn = false;
         }
      }
      break;

      case 5:
      {
         onTime = fridayOn.split ( ":" );
         onHour = onTime [ 0 ];
         onMinute = onTime [ 1 ];
         onTime = new Date ( 2015 , 1 , 1 , onHour , onMinute );

         if ( time < onTime )
         {
            mapOn = false;
         }
      }
      break;

      case 6:
      {
         offTime = saturdayOff.split ( ":" );
         offHour = offTime [ 0 ];
         offMinute = offTime [ 1 ];
         offTime = new Date ( 2015 , 1 , 1 , offHour , offMinute );
         onTime = saturdayOn.split ( ":" );
         onHour = onTime [ 0 ];
         onMinute = onTime [ 1 ];
         onTime = new Date ( 2015 , 1 , 1 , onHour , onMinute );

         if ( time < offTime ) mapOn = true;
         else if ( time < onTime )
         {
            mapOn = false;
         }
      }
      break;

   }

   if (mapOn){
     return true;
   }else {
     return false;
   }
}
var handlers = {

    "CountIntent": function () {
      var self = this;
      var speechOutput= "";
      if (checkTime){
        var trolleyAmount = 0;
        request("https://wvju16qd5k.execute-api.us-west-2.amazonaws.com/prod/trolley",function(err,res,body){
         var carData = JSON.parse(body);
         for (var car in carData) {
           if (!carData.hasOwnProperty(car)) {
             continue;
           }
           if (carData[car].constructor === Array){
             trolleyAmount++;
           }
           console.log(car);
         }
         speechOutput = "there are " + trolleyAmount + " trolleys currently running";
         self.emit(':tellWithCard', speechOutput, skillName, speechOutput);
        })
      }else {
        speechOutput = "The Trolley's have stopped for the night";
        self.emit(':tellWithCard', speechOutput, skillName, speechOutput);
      }


    },
    "LocateIntent": function () {
      var googleURL = "https://maps.googleapis.com/maps/api/geocode/json?latlng=";
      var self = this;
      var carCount=0;
      var locationsFound=0;
      var speechOutput= "There are Trolleys currently located at ";
      if (checkTime){
        request("https://wvju16qd5k.execute-api.us-west-2.amazonaws.com/prod/trolley",function(err,res,body){
         var carData = JSON.parse(body);
         for (var countCar in carData) {
           if (carData.hasOwnProperty(countCar) && carData[countCar].constructor === Array){
             carCount++;
           }
         }
         for (var car in carData) {
           if (!carData.hasOwnProperty(car)) {
             continue;
           }
           if (carData[car].constructor === Array){
             var latitude = carData[car][0];
             var longitude = carData[car][1];
             var reqURL = googleURL + latitude + "," + longitude;
              request(reqURL,function(err,res,body){
                   body = JSON.parse(body);
                   var carLocation = body.results[0].formatted_address;
                   carLocation = carLocation.substr(0, carLocation.indexOf(','));

                   locationsFound++;
                   speechOutput += carLocation+", ";
                   if (locationsFound==carCount - 1){
                     speechOutput += " and "
                   }
                   if (locationsFound==carCount && locationsFound >0){
                     self.emit(':tellWithCard', speechOutput, skillName, speechOutput);
                   }

              })


           }
           console.log(car);
         }

        })
      }else {
          speechOutput = "The Trolley's have stopped for the night";
          self.emit(':tellWithCard', speechOutput, skillName, speechOutput);
        }
      },

    "AboutIntent": function () {
        var speechOutput = "Mckinney Avenue Trolley Locator is by Conner Fullerton";
        this.emit(':tellWithCard', speechOutput, skillName, speechOutput);
    },

    "AMAZON.HelpIntent": function () {
        var speechOutput = "";
        speechOutput += "Here are some things you can say: ";
        speechOutput += "How many Trolleys are currently running";
        speechOutput += "Where are the Trolleys located currently";
        speechOutput += "Where can I catch a trolley. ";
        speechOutput += "So how can I help?";
        this.emit(':ask', speechOutput, speechOutput);
    },

    "AMAZON.StopIntent": function () {
        var speechOutput = "Goodbye";
        this.emit(':tell', speechOutput);
    },

    "AMAZON.CancelIntent": function () {
        var speechOutput = "Goodbye";
        this.emit(':tell', speechOutput);
    },

    "LaunchRequest": function () {
        var speechText = "";
        speechText += "Welcome to " + skillName + ".  I can tell you where the M Line Trolleys are currently located. ";
        speechText += "You can ask a question like, Where are the Trolleys located currently? ";
        var repromptText = "For instructions on what you can say, please say help me.";
        this.emit(':ask', speechText, repromptText);

    }

};


exports.handler = function (event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = "";
    alexa.registerHandlers(handlers);
    alexa.execute();
};
