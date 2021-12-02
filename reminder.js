const remind = require("./commands/remind");

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

class Reminder {
    constructor(timeHour, timeMinute, msgID, ownerID) {
        this.hour = timeHour,
        this.minutes = timeMinute,
        // if the time specified is before the current time, set the date to the next day
        // otherwise, set it to today
        //var currentTime = new Date();
        this.timeToRemind = this.#setRemindTime(timeHour, timeMinute);
        this.msgID = msgID,
        this.ownerID = ownerID
    }

    #setRemindTime(hours, minutes){
        var currentTime = new Date();
        var remindTime = new Date(currentTime.getFullYear,currentTime.getMonth,currentTime.getDate,hours,minutes, 0, 0);
        if(currentTime.getHours>hours && currentTime.getMinutes>minutes){
            // add a day
            return remindTime.setDate(remindTime.getDate() + 1);
        }
        return remindTime;
    }

    getOwner() {
        return this.ownerID;
    }
    getMsgID() {
        return this.msgID;
    }
    hasRemindTimePassed(){
        var currentTime = new Date();
        return currentTime > this.timeToRemind;
    }

}

module.exports = {
    Reminder: Reminder
}