import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
export const DateTimeBranch = new Mongo.Collection('date_time_branch');

DateTimeBranch.schema = new SimpleSchema({
    counter: ({type: Number}),
    available: ({type: Boolean}),
    date: ({type: String}),
    time: ({type: String}),
    branch: ({type: String})
});

Meteor.methods({
    'date_time_branch.insert': function(date, time, branch) {
        DateTimeBranch.insert({
            counter: 1,
            available: true,
            date,
            time,
            branch,
        });
        console.log('inserted new DTB');
    },

    'date_time_branch.update': function(date, time, branch) {
        DateTimeBranch.update({date, time, branch}, {
            $inc: { counter: 1 },
        });
        if(DateTimeBranch.findOne({date, time, branch}, {fields:{counter:1}}) >= 50) {   // if counter is >= 50 set available to false
            DateTimeBranch.update({date, time, branch}, {
                $set: { available: false},
            });
        }
        console.log('updated DTB');
    },

    'date_time_branch.check': function (date, branch) {
        console.log(branch + ' ' + date);
        let unavailableTimes = [];
            //returns the time for all DTB documents that match date and branch with a counter >= 50
        let matches = DateTimeBranch.find({date: date, branch: branch}, {fields:{counter:1, time:1}}).fetch();
        console.log(matches.length);
        matches.forEach((match) => {
            console.log(match.counter);
            if (match.counter >= 4) {
                console.log('unavailable time found:' + match.time);
                unavailableTimes.push(match.time); // returns the time of all bookings for the selected date and branch if the counter of those booking are >=50
            }
        })
        return Promise.await(unavailableTimes);
    },
    
    'date_time_branch.count': function (date, time, branch) {
        if (DateTimeBranch.findOne({date: date, time: time, branch: branch})) {
            let result = DateTimeBranch.findOne({date: date, time: time, branch: branch}).counter;
            console.log("Combination Method result: " + result)
            return result;
        } else {
            return 0;
        }
    },
});