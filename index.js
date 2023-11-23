require('dotenv').config()
const schedule = require('node-schedule'); 
const shell = require('shelljs');
const { IncomingWebhook } = require('@slack/webhook')

const webHookUrl = process.env.SLACK_WEBHOOK ?? 'https://hooks.slack.com/services/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'
const environment = process.env.APP_ENV ?? 'development'
const serverUrl = process.env.SERVER_URL ?? 'https://forge.laravel.com/servers/719367'
const serverName = process.env.SERVER_NAME ?? "Development Server"
const password = process.env.PASSWORD ?? ""

const webhookClient = new IncomingWebhook(webHookUrl);

const job = schedule.scheduleJob('*/5 * * * * *', async () => {
    const response = await shell.exec(`systemctl is-active nginx`)
    const status = response.stdout.trim();
    if(status !== 'active') {
        const startCommand = `sudo -S systemctl start nginx` 
        await shell.exec(startCommand)
        await shell.echo(password)
        await shell.echo('-ne "\n"')
        
        const message = {
            channel: '#server-alerts',
            text: `<${serverUrl}|${serverName} is restarted>`,
            username: environment,
            icon_emoji: ':makeitrain:',
            unfurl_links: true,
            unfurl_media: false,
            link_names: true,
        };

        try {
            await webhookClient.send(message);
        } catch (err) {
            console.log(err)
        }
    }
});