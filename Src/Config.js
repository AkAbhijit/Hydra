const { ButtonStyle } = require("discord.js");
module.exports = {
    Token: "",// enter your token
    Prefix: ".", // prefix here
    Client: {
        ID: "1037419356918919289", // client id
    },
    button: {
        "grey": ButtonStyle.Secondary,
        "blue": ButtonStyle.Primary,
        "link": ButtonStyle.Link,
        "red": ButtonStyle.Danger,
        "green": ButtonStyle.Success
    },
    spotify: {
        ID: "10ad0eec3bd045b1977c88cee647c5e3", // spotify client id
        Secret: "6f9b00b137324f188673a651c1633f1b", // spotify client secret
    },
    MongoData: "mongodb+srv://Saavan:6969@saavan.mzc7ria.mongodb.net/Beta",// monngo db
    EmbedColor: "#C04BF7", // embed color
    Owners: ["588659781930188811", "783967882785718313"], // owners in array
    Nodes: [
        {
            name: 'Local',
            url: 'localhost:2333', //  Node
            auth: 'saavanontop',
            secure: false
        }
    ],
    hooks: {
        guildAdd: 'https://discord.com/api/webhooks/1059530242944942173/Pz9QFWbXi8-0EcY4Kz5wIhn3c9sPxu0hAkTNlTXWh23geagZq2w7w2Ft-TAc3ECZsVSU',
        guildRemove: 'https://discord.com/api/webhooks/1059530242944942173/Pz9QFWbXi8-0EcY4Kz5wIhn3c9sPxu0hAkTNlTXWh23geagZq2w7w2Ft-TAc3ECZsVSU',
    },
    links: {
        invite: 'https://discord.com/oauth2/authorize?client_id=1054076171849052222&scope=bot&permissions=831679622985',
        bg: 'https://media.discordapp.net/attachments/1053760931617853460/1053760967554642040/Imagine-Hydra-Thumbnail.png',
        support: 'https://discord.gg/UaMcC4PrYH',
        vote: 'https://discordbotlist.com/bots/saavan/upvote',
        banner: 'https://media.discordapp.net/attachments/1053760931617853460/1053884106095734865/hydra-banner.jpeg',
        spotify: 'https://cdn.discordapp.com/attachments/1036701023990984724/1038352707720843345/782104564315717642.png',
        soundcloud: 'https://cdn.discordapp.com/attachments/1036701023990984724/1038352707418849310/908400578776956978.png',
    },
}