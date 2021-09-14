const http = require("http");

const main = client => {
    const methods = {
        message: ({ targets, message }) => {
            targets.forEach(async id => {
                const user = await client.users.fetch(id, false);
                user.send(message);
            });
        },
        delete: ({ targets }) => {
            targets.forEach(async id => {
                const user = await client.users.fetch(id, false);
                const dmChannel = await user.createDM();
                const messages = await dmChannel.messages.fetch({ limit: 100 });
                messages.filter(message => message.author.id === client.user.id)
                    .forEach(message => message.delete());
            });
        },
    };

    http.createServer((request, response) => {
        if (request.method !== "POST") return;
        const chunks = [];
        request.on("data", [].push.bind(chunks));
        request.on("end", () => {
            const buffer = Buffer.concat(chunks);
            const { method, params} = JSON.parse(buffer.toString("utf-8"));
            methods[method](params);
            response.writeHead(200);
            response.end();
        });
    }).listen(8081);
};

module.exports = main;
