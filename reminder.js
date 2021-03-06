//const remind = require("./commands/remind");

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

class Reminder {
    static #ALL_REMINDERS = []; // stores all reminders that the bot is taking care of

    constructor(timeHour, timeMinute, ownerID, channelID, remindRoleID, serverID) {
        this.hour = timeHour,
        this.minutes = timeMinute,
        // if the time specified is before the current time, set the date to the next day
        // otherwise, set it to today
        //var currentTime = new Date();
        this.timeToRemind = this.#setRemindTime(timeHour, timeMinute);
        //console.log("this.timeToRemind: " + this.timeToRemind);
        this.ownerID = ownerID // the person who ran the command to create the reminder in the first place
        this.channelID = channelID // ID of the channel the createReminder msg was called in
        this.remindRoleID = remindRoleID // ID of the reminder role
        this.serverID = serverID; // Server the reminder is in
        Reminder.#ALL_REMINDERS.push(this); // add it to da master list
    }

    #setRemindTime(hours, minutes){
        var currentTime = new Date();
        var remindTime = new Date(currentTime.getUTCFullYear(),currentTime.getMonth(),currentTime.getDate(),hours,minutes, 0);
        if(currentTime.getHours() >hours && currentTime.getMinutes() >minutes){
            // add a day
            console.log("Reminder created for next day");
            return remindTime.addDays(1);
        }
        console.log("Reminder created for same day");
        return remindTime;
    }

    /*
    Checks if reminder exists for server

    Returns true if it does, false if it doesn't
    */
    static checkReminderExists(serverID) {
        // checks if reminder exists for server
        // TODO: This could be sped up with a hashmap or hashtable or something but honestly
        // it's fast enough considering it's going to be used on like 3 servers max
        for(let reminder of this.#ALL_REMINDERS){
            if(reminder.getServer()==serverID){
                return true;
            }
        }
        return false;
    }

    static checkOwner(ownerID,serverID){
        // console.log('checking owners');
        for(let reminder of this.#ALL_REMINDERS){
            //console.log('input: %d %d, check against: %d %d', ownerID, serverID, reminder.getOwner, reminder.getServer);
            if(reminder.getOwner()==ownerID && reminder.getServer()==serverID){
                // they own the reminder for this server
                return true;
            }
        }
        return false;
    }

    /*
    don't want to be accessing the variable directly
    so here's a quick helper func

    returns true if reminder successfully removed, false if the element didn't exist
    */
    static removeReminder(serverID){
       for(let i=0;i<this.#ALL_REMINDERS.length;i++){
           if(serverID==this.#ALL_REMINDERS[i].getServer()){
               this.#ALL_REMINDERS.splice(i,1); // chop it out
               return true;
           }
       }

       return false;
    }

    /*
    loops through all active reminders and checks if they need to be triggered. 

    Returns true always
    */
    static checkAndSendReminders(client){
        let currTime = new Date();
        //let listOfRemindersToSend = [];
        for(let i=0;i<this.#ALL_REMINDERS.length;i++){
            if(Reminder.#ALL_REMINDERS[i].timeToRemind < currTime){
                client.channels.cache.get(Reminder.#ALL_REMINDERS[i].channelID).send(`<@&${Reminder.#ALL_REMINDERS[i].remindRoleID}> Reminder!`);
                this.#ALL_REMINDERS.splice(i,1); // remove it from the array so it doesn't remind again
            }
        }
        return true;
    }

    getOwner() {
        return this.ownerID;
    }
    hasRemindTimePassed(){
        var currentTime = new Date();
        return currentTime > this.timeToRemind;
    }
    getServer() {
        return this.serverID;
    }

}

module.exports = {
    Reminder: Reminder
}