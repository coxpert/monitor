require('dotenv').config()
const schedule = require('node-schedule'); 
const shell = require('shelljs');
const { IncomingWebhook } = require('@slack/webhook')
const moment = require('moment')

const webHookUrl = process.env.SLACK_WEBHOOK ?? 'https://hooks.slack.com/services/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'
const environment = process.env.APP_ENV ?? 'development'
const serverUrl = process.env.SERVER_URL ?? 'https://forge.laravel.com/servers/719367'
const serverName = process.env.SERVER_NAME ?? "Development Server"
const password = process.env.PASSWORD ?? ""
const webUrl = process.env.WEB_URL ?? "https://dev.dripappsserver.com"

const webhookClient = new IncomingWebhook(webHookUrl);

const job = schedule.scheduleJob("*/10 * * * * *", async () => {
  await fetch(webUrl)
    .then(async (res) => {
      if (res.status === 502) {
        const dateTime = moment().format("MMMM Do YYYY, h:mm:ss a");

        const message = {
          channel: "#server-alerts",
          text: `<${serverUrl}|${serverName} is stopped> at ${dateTime}`,
          username: environment,
          icon_emoji: ":makeitrain:",
          unfurl_links: true,
          unfurl_media: false,
          link_names: true,
        };

        try {
          await webhookClient.send(message);
        } catch (err) {
          console.log(err);
        }

        await shell.exec(`echo ${password} | sudo -S systemctl reboot`, {
          silent: true,
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});