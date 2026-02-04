const DiscordRPC = require("discord-rpc");
const cron = require("cron");

const clientId = "idhere";
const Rpc = new DiscordRPC.Client({ "transport": "ipc" });
const Month = new Array();
const Weekday = new Array(7);

let HalfDay
let TimeOfDay

Month[0] = "January"
Month[1] = "February"
Month[2] = "March"
Month[3] = "April"
Month[4] = "May"
Month[5] = "June"
Month[6] = "July"
Month[7] = "August"
Month[8] = "September"
Month[9] = "October"
Month[10] = "November"
Month[11] = "December"

Weekday[0] = "Sunday"
Weekday[1] = "Monday"
Weekday[2] = "Tuesday"
Weekday[3] = "Wednesday"
Weekday[4] = "Thursday"
Weekday[5] = "Friday"
Weekday[6] = "Saturday"

function SetTime() {
    let _Date = new Date();
    let Hours = _Date.getHours();
    // let Minutes = _Date.getMinutes();

    HalfDay = _Date.setHours(((Hours >= 12 && Hours <= 23) ? 12 : 0),0,0,0);
    SmallIcon = (Hours >= 0 && Hours < 6 || Hours >= 18 && Hours <= 23) ? "Moon" : "Sun"
    TimeOfDay = (Hours >= 0 && Hours < 6) ? "Midnight" :
        (Hours >= 6 && Hours < 12) ? "Morning" :
        (Hours >= 12 && Hours < 18 ) ? "Afternoon" :
        (Hours >= 18 && Hours < 23) ? "Evening" : "Unknown 0_0"
    if (Hours == 0 || Hours == 12) {
        HalfDay -= 43200000
    }
    Hours = ((Hours + 11) % 12 + 1);

    Rpc.setActivity({
        details: `${Month[_Date.getMonth()]} ${_Date.getDate()}, ${_Date.getFullYear()}`,
        state: `(EST) ${TimeOfDay} - ${Weekday[_Date.getDay()]}`,
        startTimestamp: HalfDay,
        
        largeImageKey: "https://github.com/HarmonicDust/ASSETS/blob/main/Clock.png?raw=true",

        smallImageKey: (SmallIcon === "Moon") ? "https://github.com/HarmonicDust/ASSETS/blob/main/Moon.png?raw=true" : "https://github.com/HarmonicDust/ASSETS/blob/main/Sun.png?raw=true",
        smallImageText: (SmallIcon === "Moon") ? "Wide awake!!" : "Asleep. DNI DURING THE DAY.",
        instance: false,
        buttons: [
            {
                label: "Break my clock lmao",
                url: "https://www.youtube.com/logout"
            }
        ]
    })
}

Rpc.on("ready", () => {
    DiscordRPC.register(clientId)
    SetTime()

    let ScheduledMessage = new cron.CronJob("*\/5 * * * *", () => SetTime)

    ScheduledMessage.start()
})

Rpc.login({clientId}).catch(console.log)