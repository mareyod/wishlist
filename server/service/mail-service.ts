import nodemailer, { Transporter } from 'nodemailer';

function getEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(
            `Требуется переменная окружения ${name}`
        );
    }

    return value;
}

class MailService {
    private readonly transporter: Transporter;
    constructor(){
        this.transporter = nodemailer.createTransport({
            host: getEnv('SMTP_HOST'),
            port: Number(getEnv('SMTP_PORT')),
            secure: false,
            auth: {
                user: getEnv('SMTP_USER'),
                pass: getEnv('SMTP_PASSWORD')
            }
        })
    }
    async sendActivationMail(to: string, link: string): Promise<void>{
        await this.transporter.sendMail({
            from:  getEnv('SMTP_USER'),
            to,
            subject: 'Активация аккаунта на ' + getEnv('API_URL'),
            text:'',
            html: 
                `
                    <div>
                        <h1>Для активации аккаунта перейдите по ссылке</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
        })
    }
}

export default new MailService();