const alexaSDK = require('alexa-sdk');
const AWS = require('aws-sdk');
const moment = require('moment')
const appId = 'amzn1.ask.skill.b457130f-fb08-49da-a280-f7bcb7f33f51';
const fragebogenTable = 'Fragebogen';
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');

const instructions = 'Willkommen zu PHQ-9 Fragebogen. Sagen Sie bitte starte Umfrage, um die Umfrage zu starten. Sagen Sie stop, wenn Sie die Umfrage beenden wollen. Schätzen Sie jede Frage auf einer Skala von eins bis vier, wo eins ist Überhaupt nicht, zwei An einzelnen Tagen, drei An mehr als der Hälfte der Tagen, vier Beinahe jeden Tag.'; 
const currDate = new moment().subtract(10, 'days').calendar()

const handlers = {

  /**
   * Triggered when the user says "Alexa, open PQ9 Fragebogen.
   */
  'LaunchRequest'() {
    this.emit(':ask', instructions);
  },

  /**
   * Adds a new questionnaire for the current user.
   * Slots: Nine questions
   */
  'StartIntent'() {
    const { userId } = this.event.session.user;
    const { slots } = this.event.request.intent;

    // prompt for slot values and request a confirmation for each
    // PHQ_one
    if (!slots.PHQ_one.value) {
      const slotToElicit = 'PHQ_one';
      const speechOutput = 'Wie oft fühlten Sie sich im Verlauf der letzten zwei Wochen durch die folgenden Beschwerden beeinträchtigt. Wenig Interesse oder Freude an Ihren Tätigkeiten?';
      const repromptSpeech = 'Haben Sie wenig Interesse oder Freude an Ihren Tätigkeiten?';
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }
    else if (slots.PHQ_one.confirmationStatus !== 'CONFIRMED') {

      if (slots.PHQ_one.confirmationStatus !== 'DENIED') {
        // slot status: unconfirmed
        const slotToConfirm = 'PHQ_one';
        const speechOutput = `Ihre Antwort ist ${slots.PHQ_one.value}, richtig?`;
        const repromptSpeech = speechOutput;
        return this.emit(':confirmSlot', slotToConfirm, speechOutput, repromptSpeech);
      }

      // slot status: denied -> reprompt for slot data
      const slotToElicit = 'PHQ_one';
      const speechOutput = 'Wie oft fühlten Sie sich im Verlauf der letzten zwei Wochen durch die folgenden Beschwerden beeinträchtigt?'; 
      //Schätzen Sie auf einer Skala von eins bis vier: Wenig Interesse oder Freude an Ihren Tätigkeiten.';
      const repromptSpeech = 'Haben Sie wenig Interesse oder Freude an Ihren Tätigkeiten?';
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }


    // PHQ_two
    if (!slots.PHQ_two.value) {
      const slotToElicit = 'PHQ_two';
      const speechOutput = 'Haben Sie Niedergeschlagenheit, Schwermut oder Hoffnungslosigkeit?';
      const repromptSpeech = 'Haben Sie Niedergeschlagenheit, Schwermut oder Hoffnungslosigkeit?';
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }
    else if (slots.PHQ_two.confirmationStatus !== 'CONFIRMED') {

      if (slots.PHQ_two.confirmationStatus !== 'DENIED') {
        // slot status: unconfirmed
        const slotToConfirm = 'PHQ_two';
        const speechOutput = `Ihre Antwort ist ${slots.PHQ_two.value}, richtig?`;
        const repromptSpeech = speechOutput;
        return this.emit(':confirmSlot', slotToConfirm, speechOutput, repromptSpeech);
      }

      // slot status: denied -> reprompt for slot data
      const slotToElicit = 'PHQ_two';
      const speechOutput = 'Niedergeschlagenheit, Schwermut oder Hoffnungslosigkeit?';
      const repromptSpeech = 'Haben Sie Niedergeschlagenheit, Schwermut oder Hoffnungslosigkeit?';
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }


    // PHQ_three
    if (!slots.PHQ_three.value) {
      const slotToElicit = 'PHQ_three';
      const speechOutput = 'Haben Sie Schwierigkeiten ein- oder durchzuschlafen oder vermehrter Schlaf?';
      const repromptSpeech = 'Haben Sie Schwierigkeiten ein- oder durchzuschlafen oder vermehrter Schlaf?';
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }
    else if (slots.PHQ_three.confirmationStatus !== 'CONFIRMED') {

      if (slots.PHQ_three.confirmationStatus !== 'DENIED') {
        // slot status: unconfirmed
        const slotToConfirm = 'PHQ_three';
        const speechOutput = `Ihre Antwort ist ${slots.PHQ_three.value}, richtig?`;
        const repromptSpeech = speechOutput;
        return this.emit(':confirmSlot', slotToConfirm, speechOutput, repromptSpeech);
      }

      // slot status: denied -> reprompt for slot data
      const slotToElicit = 'PHQ_three';
      const speechOutput = 'Haben Sie Schwierigkeiten ein- oder durchzuschlafen oder vermehrter Schlaf?';
      const repromptSpeech = 'Haben Sie Schwierigkeiten ein- oder durchzuschlafen oder vermehrter Schlaf?';
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }


        // PHQ_four
    if (!slots.PHQ_four.value) {
      const slotToElicit = 'PHQ_four';
      const speechOutput = 'Haben Sie Müdigkeit oder Gefühl, keine Energie zu haben?';
      const repromptSpeech = 'Haben Sie Müdigkeit oder Gefühl, keine Energie zu haben?';
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }
    else if (slots.PHQ_four.confirmationStatus !== 'CONFIRMED') {

      if (slots.PHQ_four.confirmationStatus !== 'DENIED') {
        // slot status: unconfirmed
        const slotToConfirm = 'PHQ_four';
        const speechOutput = `Ihre Antwort ist ${slots.PHQ_four.value}, richtig?`;
        const repromptSpeech = speechOutput;
        return this.emit(':confirmSlot', slotToConfirm, speechOutput, repromptSpeech);
      }

      // slot status: denied -> reprompt for slot data
      const slotToElicit = 'PHQ_four';
      const speechOutput = 'Haben Sie Müdigkeit oder Gefühl, keine Energie zu haben?';
      const repromptSpeech = 'Haben Sie Müdigkeit oder Gefühl, keine Energie zu haben?';
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }


        // PHQ_five
    if (!slots.PHQ_five.value) {
      const slotToElicit = 'PHQ_five';
      const speechOutput = 'Haben Sie Verminderter Appetit oder übermäßiges Bedürfnis zu essen?';
      const repromptSpeech = 'Haben Sie Verminderter Appetit oder übermäßiges Bedürfnis zu essen?';
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }
    else if (slots.PHQ_five.confirmationStatus !== 'CONFIRMED') {

      if (slots.PHQ_five.confirmationStatus !== 'DENIED') {
        // slot status: unconfirmed
        const slotToConfirm = 'PHQ_five';
        const speechOutput = `Ihre Antwort ist ${slots.PHQ_five.value}, richtig?`;
        const repromptSpeech = speechOutput;
        return this.emit(':confirmSlot', slotToConfirm, speechOutput, repromptSpeech);
      }

      // slot status: denied -> reprompt for slot data
      const slotToElicit = 'PHQ_five';
      const speechOutput = 'Haben Sie Verminderter Appetit oder übermäßiges Bedürfnis zu essen?';
      const repromptSpeech = 'Haben Sie Verminderter Appetit oder übermäßiges Bedürfnis zu essen?';
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }


        // PHQ_six
    if (!slots.PHQ_six.value) {
      const slotToElicit = 'PHQ_six';
      const speechOutput = 'Haben Sie Schlechte Meinung von sich selbst, Gefühl, ein Versager zu sein oder die Familie enttäuscht zu haben?';
      const repromptSpeech = 'Haben Sie Schlechte Meinung von sich selbst, Gefühl, ein Versager zu sein oder die Familie enttäuscht zu haben?';
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }
    else if (slots.PHQ_six.confirmationStatus !== 'CONFIRMED') {

      if (slots.PHQ_six.confirmationStatus !== 'DENIED') {
        // slot status: unconfirmed
        const slotToConfirm = 'PHQ_six';
        const speechOutput = `Ihre Antwort ist ${slots.PHQ_six.value}, richtig?`;
        const repromptSpeech = speechOutput;
        return this.emit(':confirmSlot', slotToConfirm, speechOutput, repromptSpeech);
      }

      // slot status: denied -> reprompt for slot data
      const slotToElicit = 'PHQ_six';
      const speechOutput = 'Haben Sie Schlechte Meinung von sich selbst, Gefühl, ein Versager zu sein oder die Familie enttäuscht zu haben?';
      const repromptSpeech = 'Haben Sie Schlechte Meinung von sich selbst, Gefühl, ein Versager zu sein oder die Familie enttäuscht zu haben?';
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }


        // PHQ_seven
    if (!slots.PHQ_seven.value) {
      const slotToElicit = 'PHQ_seven';
      const speechOutput = 'Haben Sie Schwierigkeiten, sich auf etwas zu konzentrieren, zum Beispiel beim Zeitunglesen oder Fernsehen?';
      const repromptSpeech = 'Haben Sie Schwierigkeiten, sich auf etwas zu konzentrieren, zum Beispiel beim Zeitunglesen oder Fernsehen?';
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }
    else if (slots.PHQ_seven.confirmationStatus !== 'CONFIRMED') {

      if (slots.PHQ_seven.confirmationStatus !== 'DENIED') {
        // slot status: unconfirmed
        const slotToConfirm = 'PHQ_seven';
        const speechOutput = `Ihre Antwort ist ${slots.PHQ_seven.value}, richtig?`;
        const repromptSpeech = speechOutput;
        return this.emit(':confirmSlot', slotToConfirm, speechOutput, repromptSpeech);
      }

      // slot status: denied -> reprompt for slot data
      const slotToElicit = 'PHQ_seven';
      const speechOutput = 'Haben Sie Schwierigkeiten, sich auf etwas zu konzentrieren, zum Beispiel beim Zeitunglesen oder Fernsehen?';
      const repromptSpeech = 'Haben Sie Schwierigkeiten, sich auf etwas zu konzentrieren, zum Beispiel beim Zeitunglesen oder Fernsehen?';
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }


        // PHQ_eight
    if (!slots.PHQ_eight.value) {
      const slotToElicit = 'PHQ_eight';
      const speechOutput = 'Waren Ihre Bewegungen oder Ihre Sprache so verlangsamt, dass es auch anderen auffallen würde. Oder waren Sie im Gegenteil zappelig oder ruhelos und hatten dadurch einen stärkeren Bewegungsdrang als sonst?';
      const repromptSpeech = 'Waren Ihre Bewegungen oder Ihre Sprache so verlangsamt, dass es auch anderen auffallen würde. Oder waren Sie im Gegenteil zappelig oder ruhelos und hatten dadurch einen stärkeren Bewegungsdrang als sonst?';
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }
    else if (slots.PHQ_eight.confirmationStatus !== 'CONFIRMED') {

      if (slots.PHQ_eight.confirmationStatus !== 'DENIED') {
        // slot status: unconfirmed
        const slotToConfirm = 'PHQ_eight';
        const speechOutput = `Ihre Antwort ist ${slots.PHQ_eight.value}, richtig?`;
        const repromptSpeech = speechOutput;
        return this.emit(':confirmSlot', slotToConfirm, speechOutput, repromptSpeech);
      }

      // slot status: denied -> reprompt for slot data
      const slotToElicit = 'PHQ_eight';
      const speechOutput = 'Waren Ihre Bewegungen oder Ihre Sprache so verlangsamt, dass es auch anderen auffallen würde. Oder waren Sie im Gegenteil zappelig oder ruhelos und hatten dadurch einen stärkeren Bewegungsdrang als sonst?';
      const repromptSpeech = 'Waren Ihre Bewegungen oder Ihre Sprache so verlangsamt, dass es auch anderen auffallen würde. Oder waren Sie im Gegenteil zappelig oder ruhelos und hatten dadurch einen stärkeren Bewegungsdrang als sonst?';
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }


        // PHQ_nine
    if (!slots.PHQ_nine.value) {
      const slotToElicit = 'PHQ_nine';
      const speechOutput = 'Haben Sie Gedanken, dass Sie lieber tot wären oder sich Leid zufügen möchten?';
      const repromptSpeech = 'Haben Sie Gedanken, dass Sie lieber tot wären oder sich Leid zufügen möchten?';
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }
    else if (slots.PHQ_nine.confirmationStatus !== 'CONFIRMED') {

      if (slots.PHQ_nine.confirmationStatus !== 'DENIED') {
        // slot status: unconfirmed
        const slotToConfirm = 'PHQ_nine';
        const speechOutput = `Ihre Antwort ist ${slots.PHQ_nine.value}, richtig?`;
        const repromptSpeech = speechOutput;
        return this.emit(':confirmSlot', slotToConfirm, speechOutput, repromptSpeech);
      }

      // slot status: denied -> reprompt for slot data
      const slotToElicit = 'PHQ_nine';
      const speechOutput = 'Haben Sie Gedanken, dass Sie lieber tot wären oder sich Leid zufügen möchten?';
      const repromptSpeech = 'Haben Sie Gedanken, dass Sie lieber tot wären oder sich Leid zufügen möchten?';
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }

    // all slot values received and confirmed, now add the record to DynamoDB

      console.log("\n\nLoading handler\n\n");
      const phq_one = slots.PHQ_one.value;
      const phq_two = slots.PHQ_two.value;
      const phq_three = slots.PHQ_two.value;
      const phq_vier = slots.PHQ_two.value;
      const phq_five = slots.PHQ_two.value;
      const phq_six = slots.PHQ_two.value;
      const phq_seven = slots.PHQ_two.value;
      const phq_eight = slots.PHQ_two.value;
      const phq_nine = slots.PHQ_two.value;

      const dynamodbParams = {
        TableName: fragebogenTable,
        Item: {
          Id: uuid.v4(),
          UserId: userId,
          CurrDate: currDate,
          PHQ_one: phq_one,
          PHQ_two: phq_two,
          PHQ_three: phq_three,
          PHQ_vier: phq_vier,
          PHQ_five: phq_five,
          PHQ_six: phq_six,
          PHQ_seven: phq_seven,
          PHQ_eight: phq_eight,
          PHQ_nine: phq_nine
        },
      };

      console.log('Attempting to add fragebogen', dynamodbParams); 
      
      dynamoDb.put(dynamodbParams).promise()
      .then(data => {
        console.log('expense saved: ', dynamodbParams);
        this.emit(':ask', 'Ihre Antworte wurden hinzugefügt. Bis zum nächsten mal.');
      })
      .catch(err => {
        console.error(err);
        this.emit(':tell', 'Es ist ein Problem getroffen!');
      });
  },

  'Unhandled': function () {
    this.emit('AMAZON.HelpIntent');
  },

  'AMAZON.HelpIntent'() {
    const speechOutput = instructions;
    const reprompt = instructions;
    this.emit(':ask', speechOutput, reprompt);
  },

  'AMAZON.CancelIntent'() {
    this.emit(':tell', 'Wieder sehen!');
  },

  'AMAZON.StopIntent'() {
    this.emit(':tell', 'Wieder sehen!');
  }

};

exports.handler = function handler(event, context) {
  const alexa = alexaSDK.handler(event, context);
  alexa.APP_ID = appId;
  alexa.registerHandlers(handlers);
  alexa.execute();
};