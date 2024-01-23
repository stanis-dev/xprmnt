import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import AuthConfig from 'src/config/auth.config';

const getCustomerPlan = (apiKey: string | string[] | undefined) => {
  const customerPlans = [
    {
      apiKey: 'foo',
      rateLimit: 20,
    },
    {
      apiKey: 'bar',
      rateLimit: 30,
    },
  ] as const;

  return customerPlans.find((plan) => plan.apiKey === apiKey);
};

export function RateLimitMiddleware(authConfig: AuthConfig) {
  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    keyGenerator: (req) =>
      `${(req.headers[authConfig.apiHeaderName] as string) || 'no-api-key'}${req.ip}`,
    limit: (req) => {
      const apiKey = req.headers[authConfig.apiHeaderName];
      if (!apiKey || typeof apiKey !== 'string') {
        return authConfig.unathenticatedRateLimit;
      }

      const customerPlan = getCustomerPlan(apiKey);
      const rateLimit =
        customerPlan?.rateLimit || authConfig.unathenticatedRateLimit;
      console.log('rateLimit', rateLimit);
      return rateLimit;
    },
    message:
      'You have exceeded the amount of requests that your plan allows, please try again after 1 minute or upgrade your plan',
  });
  return function (req: Request, res: Response, next: NextFunction) {
    return limiter(req, res, next);
  };
}
