// Oliver Kovacs MIT

const fs = require("fs");
const path = require("path");

const { Client, Intents } = require("discord.js");
const client = new Client({ intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
] });

const isDirectory = directory => element => {
    return !fs.lstatSync(path.join(directory, element)).isDirectory();
};

const loadModules = directory => {
    fs.readdirSync(directory)
        .filter(isDirectory(directory))
        .filter(file => file.match(/^.*\.js$/))
        .forEach(file => require(path.resolve(directory, file))(client));
};

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
    loadModules("./modules");
});

const token = fs.readFileSync("./token", "utf-8");
client.login(token);
