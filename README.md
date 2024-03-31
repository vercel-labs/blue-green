[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel-labs%2Fblue-green&project-name=blue-gree-on-vercel&repository-name=blue-gree-on-vercel&demo-title=Blue-Green%20deployments%20on%20Vercel&demo-description=See%20how%20Vercel's%20Skew%20Protection%20feature%20enables%20production-ready%20blue-green%20deployments%20with%20just%20a%20few%20lines%20of%20code.&demo-url=https%3A%2F%2Fblue-green.vercel.rocks&demo-image=https%3A%2F%2Fvercel.com%2F_next%2Fimage%3Furl%3Dhttps%253A%252F%252Fimages.ctfassets.net%252Fe5382hct74si%252F4xnSnpCnkYCw6ZzZcCXVVv%252F5e0c6666fe0b9583f42e84d5493b75a5%252Fblue-green.png%26w%3D3840%26q%3D75%26dpl%3Ddpl_8ZzCwcUW4b6UdGfjetyMvumYaoqS)

# Blue-Green deployments and canary deployments on Vercel

Blue-green deployments is a deployment strategy where you serve two versions of your application, "Blue" and "Green". You serve the current version of your application (Blue) and then you can then deploy a different version of your application (Green) without affecting the Blue environment.

- [Demo](https://blue-green.vercel.app)
- [Detailed guide](https://vercel.com/guides/blue_green_deployments_on_vercel)

This keeps your Blue application running seamlessly for production users while you test and deploy to your Green application. When you're done testing and ready to serve user's your Green application, you can incrementally or fully switch to your new Green application with no perceptible change for your users.

This is typically done using load balancers to direct traffic, but with [Vercel's generated urls](https://vercel.com/docs/deployments/generated-urls) you can instantly switch which application is served to users seamlessly using [Skew Protection](https://vercel.com/docs/deployments/skew-protection), [Edge Config](https://vercel.com/docs/storage/edge-config), and [Middleware in Next.js](https://nextjs.org/docs/app/building-your-application/routing/middleware). By using Skew Protection, the assignment to the blue or green deployments are sticky across Vercel's entire global CDN, edge functions, and serverless function infrastructure. This ensures users are never shuffling between the blue and green deployment in a given session.

The blue-green deployment strategy is great for managing risk, giving you the ability to gradually roll out a new version of your application (including breaking changes) or go back to using the previous version instantaneously.

## Getting started

- [Deploy this template](https://vercel.com/templates/next.js/blue-green-deployments-vercel)
- Activate [Skew Protection](https://vercel.com/docs/deployments/skew-protection) for the project
- Activate [Deployment protection bypass](https://vercel.com/docs/security/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation) for the project
- Create an [Edge Config](https://vercel.com/docs/storage/edge-config)
- Use the following Edge Config settings:

```json
{
  "blue-green-configuration": {
    "deploymentDomainBlue": "https://blue-green-61yvm4f5d.vercel.rocks",
    "deploymentDomainGreen": "https://blue-green-nq2hvhtsv.vercel.rocks",
    "trafficGreenPercent": 50
  }
}
```

The fields `deploymentDomainBlue` and `deploymentDomainGreen` must be valid [deployment domains](https://vercel.com/docs/deployments/generated-urls) for your projects.

See this project's [`middleware.ts` file](https://github.com/vercel-labs/blue-green/blob/main/middleware.ts) for the logic implementing the blue-green logic.

## Executing a blue-green deployment

With both deployments using the same [Middleware in this project](https://github.com/vercel-labs/blue-green/blob/main/middleware.ts), Vercel will only serve the deployment specified in your Edge Config.

The simplest way to perform a blue-green deployment would be to manually update the Edge Config. Upon saving it, the new deployments will begin serving.

For CI/CD-driven blue-green deployments, you can automate deployments using the [Edge Config API](https://vercel.com/docs/storage/edge-config/vercel-api#update-your-edge-config-items) in your CI/CD pipeline. You can see a working example of this in action by viewing the [GitHub Action in this project](https://github.com/vercel-labs/blue-green/blob/main/.github/workflows/cron-blue-green-deploy.yml). It creates new deployments and updates the Edge Config with the new deployment urls.
