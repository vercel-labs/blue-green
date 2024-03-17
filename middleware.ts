import { get } from "@vercel/edge-config";
import { NextRequest, NextResponse } from "next/server";

interface BlueGreenConfig {
  deploymentDomainBlue: string;
  deploymentDomainGreen: string;
  trafficGreenPercent: number;
}

export async function middleware(req: NextRequest) {
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
  return random < blueGreenConfig.trafficGreenPercent
    ? blueGreenConfig.deploymentDomainGreen
    : blueGreenConfig.deploymentDomainBlue;
}
