Blue-green deployments (also knows as canary deployments) for Vercel.

[For a demo, click here.](https://blue-green.vercel.app/)

## Getting Started

- Deploy the project to Vercel
- Activate [Skew Protection](https://vercel.com/docs/deployments/skew-protection) for the project.
- Activate [Deployment protection bypass](https://vercel.com/docs/security/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation) for the project.
- Create an [Edge Config](https://vercel.com/docs/storage/edge-config).
- Deploy the following Edge Config:

```json
{
  "blue-green-configuration": {
    "deploymentDomainBlue": "blue-r7nr8gkr5.vercel.app",
    "deploymentDomainGreen": "green-r7nr8gkr5.vercel.app",
    "trafficGreenPercent": 50
  }
}
```

The fields `deploymentDomainBlue` and `deploymentDomainGreen` must be valid deployments for your projects.

See this project's [middleware.ts file](https://github.com/vercel-labs/blue-green/blob/main/middleware.ts) for the logic implementing the blue-green/canary logic.

## Executing a blue-green deployment

With the middleware belonging to this project deployed, Vercel will only serve the deployment specified in your Edge Config. The simplest way to perform a blue-green deployment would be to manually update the Edge Config. Upon saving it, the new deployments will begin serving.

For CI/CD-driven blue-green deployments, you can integrate the [Edge Config API](https://vercel.com/docs/storage/edge-config/vercel-api#update-your-edge-config-items) with your CD system.
