import { get } from "@vercel/edge-config";
import { NextRequest, NextResponse } from "next/server";

interface BlueGreenConfig {
  deploymentDomainBlue: string;
  deploymentDomainGreen: string;
  trafficGreenPercent: number;
}

export async function middleware(req: NextRequest) {
  console.info(
    "Middleware",
    req.headers.get("sec-fetch-dest"),
    req.method,
    req.headers.get("x-deployment-override")
  );
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }
  if (req.method !== "GET") {
    return NextResponse.next();
  }
  if (req.headers.get("sec-fetch-dest") !== "document") {
    return NextResponse.next();
  }
  if (req.headers.get("x-deployment-override")) {
    return NextResponse.next();
  }
  const blueGreenConfig = await get<BlueGreenConfig>(
    "blue-green-configuration"
  );
  if (!blueGreenConfig) {
    console.warn("No blue-green configuration found");
    return NextResponse.next();
  }
  const servingDeploymentDomain = process.env.VERCEL_URL;
  const selectedDeploymentDomain =
    selectBlueGreenDeploymentDomain(blueGreenConfig);
  console.info(
    "Selected deployment domain",
    selectedDeploymentDomain,
    blueGreenConfig
  );
  if (!selectedDeploymentDomain) {
    return NextResponse.next();
  }
  if (servingDeploymentDomain === selectedDeploymentDomain) {
    return NextResponse.next();
  }
  const headers = new Headers(req.headers);
  headers.set("x-deployment-override", selectedDeploymentDomain);
  headers.set(
    "x-vercel-protection-bypass",
    process.env.VERCEL_AUTOMATION_BYPASS_SECRET || "unknown"
  );
  const url = new URL(req.url);
  url.hostname = selectedDeploymentDomain;
  return fetch(url, {
    headers,
    redirect: "manual",
  });
}

function selectBlueGreenDeploymentDomain(blueGreenConfig: BlueGreenConfig) {
  const random = Math.random() * 100;

  const selected =
    random < blueGreenConfig.trafficGreenPercent
      ? blueGreenConfig.deploymentDomainGreen
      : blueGreenConfig.deploymentDomainBlue || process.env.VERCEL_URL;
  if (!selected) {
    console.error("Blue green configuration error", blueGreenConfig);
  }
  return null;
}
