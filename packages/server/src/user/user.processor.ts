import { OnQueueActive, Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";
import * as sharp from "sharp";
import { join } from "path";

import { PrismaService } from "src/prisma/prisma.service";
import { MailerService } from "@nestjs-modules/mailer";

sharp.cache(false);

interface IEmailer {
  email: string;
  subject: string;
  context: any;
}

@Processor("users-queue")
export class UserQueueProcessor {
  constructor(
    private prisma: PrismaService,
    private readonly mailer: MailerService,
  ) {}

  private readonly logger = new Logger(UserQueueProcessor.name);

  private async resizeFile(path: string) {
    const rect = Buffer.from(
      '<svg><rect x="0" y="0" width="400" height="400" rx="200" ry="200"/></svg>',
    );
    let buffer = await sharp(path)
      .resize(400, 400, {
        fit: sharp.fit.cover,
        withoutEnlargement: true,
      })
      .composite([
        {
          input: rect,
          blend: "dest-in",
        },
      ])
      .sharpen()
      .toBuffer();

    const [filename] = path.split(".");
    sharp(buffer).toFile(filename + ".png");
    sharp(buffer).toFile(filename + ".avif");
    sharp(buffer)
      .webp({ quality: 90 })
      .toFile(filename + ".webp");
    return sharp(buffer).toFile(path);
  }

  private async emailer(template: string, data: IEmailer) {
    try {
      const d = await this.mailer.sendMail({
        to: data.email,
        template: `emails/${template}`,
        subject: data.subject,
        context: data.context,
      });

      this.logger.log(d);
    } catch (e) {
      console.log(e);
    }
  }

  @Process("verify-email")
  async handleVerifyEmail(job: Job) {
    this.logger.debug("[handleVerifyEmail]: start", job.data);
    await this.emailer("verify-email", job.data);
    this.logger.debug("email sent");
  }

  @Process("img-transform")
  async handleImageTransform(job: Job) {
    const data = job.data;
    this.logger.debug("[handleImageTransform]: start");
    const filepath = join(process.cwd(), data.path);
    await this.resizeFile(filepath);
    this.logger.debug("[handleImageTransform]: resize complete");
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(
        job.data,
      )}...`,
    );
  }
}
