// sportsDay.js
const readline = require('readline');

function OpeningCeremony(initialScore, callback) {
    console.log("========= Opening Ceremony has begun! =========");


    let score = initialScore;

    let counter = 1;

    const intervalId = setInterval(() => {

        counter++;

        if (counter > 3) {

            clearInterval(intervalId);
            console.log(" Let the games begin! Initial Score:", score);


            callback(score, LongJump);
        }
    }, 1000);
}


function Race100M(score, callback) {
    console.log("========== RACE 100M IS NEXT! STARTED ==========");

    setTimeout(() => {
        let times = {
            red: Math.floor(Math.random() * 6) + 10,
            blue: Math.floor(Math.random() * 6) + 10,
            green: Math.floor(Math.random() * 6) + 10,
            yellow: Math.floor(Math.random() * 6) + 10
        };
        console.log(" Race Time: ", times);

        const sortedItem = Object.keys(times).sort((a, b) => times[a] - times[b]);

        const first = sortedItem[0];
        const second = sortedItem[1];

        score[first] += 50;
        score[second] += 25;

        console.log(` ${first} wins 50 points`);
        console.log(` ${second} wins 25 points`);
        console.log(` Updated Score after Race 100M: `, score);
        callback(score, HighJump);

    }, 3000)
}

function LongJump(score, callback) {
    console.log("======== Long Jump is next! Started ==========");

    setTimeout(() => {
        const color = ['red', 'blue', 'green', 'yellow'];

        const randomIndex = Math.floor(Math.random() * color.length);
        const winner = color[randomIndex];

        score[winner] += 150;

        console.log(` ${winner} wins the long jump`);
        console.log(` Updated Score after Long Jump: `, score);

        callback(score, AwardCeremony);
    }, 2000);
}

function HighJump(score, callback) {
    console.log("============ High Jump is starting ============");


    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });


    rl.question(" What color secured the highest jump? (red/blue/green/yellow): ", (answer) => {


        const color = answer.trim().toLowerCase();


        if (['red', 'blue', 'green', 'yellow'].includes(color)) {
            score[color] += 100;
            console.log(` ${color} wins the High Jump and gets 100 points!`);
        } else {
            console.log(" Invalid color or no input. Event was cancelled, no points awarded.");
        }

        console.log(" Updated Score after HighJump:", score);


        rl.close();


        callback(score);
    });
}


function AwardCeremony(score) {
    console.log("=========== Award Ceremony is starting ===========");


    const sortedTeams = Object.keys(score).sort((a, b) => score[b] - score[a]);

    console.log("=========== FINAL SCOREBOARD ===========");
    console.log(score);

    console.log(` 1st Place: ${sortedTeams[0]} with ${score[sortedTeams[0]]} points!`);
    console.log(` 2nd Place: ${sortedTeams[1]} with ${score[sortedTeams[1]]} points!`);
    console.log(` 3rd Place: ${sortedTeams[2]} with ${score[sortedTeams[2]]} points!`);

    console.log(" SPORTS DAY IS OFFICIALLY OVER! ");
}





OpeningCeremony({ red: 5, blue: 2, green: 6, yellow: 1 }, Race100M);
