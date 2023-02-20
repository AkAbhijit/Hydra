const { ButtonStyle } = require("discord.js");
module.exports = {
    Token: "MTA3MjE4OTM2NzI0Nzk2NjIxOQ.GaKXXV.04gDhU9IFsiaXxxap_X_mxM48WCV2d7QH0HArw",// enter your token
    Prefix: "+", // prefix here
    Client: {
        ID: "1072189367247966219", // client id
    },
    button: {
        "grey": ButtonStyle.Secondary,
        "blue": ButtonStyle.Primary,
        "link": ButtonStyle.Link,
        "red": ButtonStyle.Danger,
        "green": ButtonStyle.Success
    },
    spotify: {
        ID: "731ac5bf0603411f80ac446f5c02e290", // spotify client id
        Secret: "cd16a34c385b4fa5915abd596fd4e480", // spotify client secret
    },
    MongoData: "mongodb+srv://Saavan:6969@saavan.mzc7ria.mongodb.net/Beta",// monngo db
    EmbedColor: "#000000", // embed color
    Owners: ["777538136782667796", "777538136782667796"], // owners in array
    Nodes: [
        {
            name: 'krn.2d.gay', // Node Name
            url: 'krn.2d.gay:443', //  Node Ip And : Port
            auth: 'AWP)JQ$Gv9}dm.u', // Node Password
            secure: true
        }
    ],
    hooks: {
        guildAdd: 'https://discord.com/api/webhooks/1031486168036016138/b2xBPrAtHpYJlWnAoF7nfk8p5IznorKmE_an8PsAwihXhHZh64iRpd75qM3jeI5jGa0M',
        guildRemove: 'https://discord.com/api/webhooks/1031486168036016138/b2xBPrAtHpYJlWnAoF7nfk8p5IznorKmE_an8PsAwihXhHZh64iRpd75qM3jeI5jGa0M',
    },
    links: {
        invite: 'https://discord.com/oauth2/authorize?client_id=1072189367247966219&scope=bot&permissions=831679622985',
        bg: ("https://media.discordapp.net/attachments/1011709031687147550/1077159658281766912/maxresdefault_1.jpg"),
        support: 'https://discord.gg/MSQeXpvJSV',
        vote: 'https://discordbotlist.com/bots/qod-7134/upvote',
        banner: 'https://media.discordapp.net/attachments/1011709031687147550/1077197657577107557/Picsart_23-02-20_17-28-14-257.jpg',
        spotify: 'https://cdn.discordapp.com/attachments/1036701023990984724/1038352707720843345/782104564315717642.png',
        soundcloud: 'https://cdn.discordapp.com/attachments/1036701023990984724/1038352707418849310/908400578776956978.png',
    },
}
