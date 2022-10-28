import { Inject, Injectable, CACHE_MANAGER } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cache } from "cache-manager";

@Injectable({})
export class AuthCacheService {
  constructor(
    private config: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  CACHEKEY: string = this.config.get("IGNORED_TOKENS_CACHE");

  async getFromCache(key: string): Promise<any> {
    return this.cacheManager.get(key);
  }

  async setIgnoreToken(accessToken: string): Promise<void> {
    if (accessToken) {
      const ttl = 20 * 60 * 1000;
      const ignoredTokens = await this.cacheManager.get<Set<string>>(
        this.CACHEKEY,
      );
      if (ignoredTokens) {
        ignoredTokens.add(accessToken);
        await this.cacheManager.set(this.CACHEKEY, ignoredTokens, ttl);
      } else {
        await this.cacheManager.set(
          this.CACHEKEY,
          new Set<string>([accessToken]),
          ttl,
        );
      }
    }
  }

  async getIngoredTokens(): Promise<Set<string> | undefined> {
    return this.cacheManager.get(this.CACHEKEY);
  }
}
